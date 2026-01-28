const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-change-in-prod';

// Helper to generate access and refresh tokens
function generateTokens(user) {
  const payload = {
    userId: user.id,
    role: user.role,
    entityId: user.entity_id
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }); // Short lived
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' }); // Long lived

  return { accessToken, refreshToken };
}

// REGISTER (Admin or Public?) - Let's allow public for now for demo, but typically restricted
router.post('/register', async (req, res) => {
  const { email, password, role, entityId } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: passwordHash,
        role,
        entity_id: entityId || null
      }])
      .select()
      .single();

    if (error) throw error;

    // 4. Return user (no password)
    const { password_hash, ...userProfile } = newUser;
    res.status(201).json({ message: "User registered successfully", user: userProfile });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // 1. Find user by email or username (or both)
    let query = supabase.from('users').select('*');

    if (email && username) {
      query = query.eq('email', email).eq('username', username);
    } else if (email) {
      query = query.eq('email', email);
    } else if (username) {
      query = query.eq('username', username);
    } else {
      return res.status(400).json({ error: "Email or username required" });
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // 4. Store refresh token in DB
    await supabase.from('refresh_tokens').insert([{
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }]);

    // 5. Update last login
    await supabase.from('users').update({ last_login: new Date() }).eq('id', user.id);

    // 6. Return response
    const { password_hash, ...userProfile } = user;
    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userProfile,
      expires_in: 900 // 15 mins
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// AMBULANCE LOGIN (Simple Plate + Password)
router.post('/login/ambulance', async (req, res) => {
  const { plateNumber, password } = req.body;

  if (!plateNumber || !password) {
    return res.status(400).json({ error: "Plate number and password required" });
  }

  try {
    // 1. Find ambulance by plate number
    const { data: ambulance, error } = await supabase
      .from('ambulances')
      .select('id, plate_number, home_hospital_id')
      .eq('plate_number', plateNumber)
      .single();

    if (error || !ambulance) {
      // Auto-register logic for Demo/Hackathon if not found? 
      // Or strict? Let's be strict but friendly.
      return res.status(401).json({ error: "Ambulance not registered in system." });
    }

    // 2. Simple Password Check (For hackathon: 'ambulance123' or match plate?)
    // In real app, we'd check linked user password.
    // Let's assume a universal passcode for now or check against a hardcoded "driver_password" if we don't have user users linked.
    if (password !== 'ambulance123' && password !== 'admin') {
      return res.status(401).json({ error: "Invalid Access Code" });
    }

    // 3. Generate Token (Payload relevant for socket room)
    const userPayload = {
      id: ambulance.id, // Use ambulance ID as User ID for simplicity in this flow
      role: 'ambulance',
      entityId: ambulance.id
    };

    const { accessToken, refreshToken } = generateTokens(userPayload); // Reusing helper

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: ambulance.id,
        name: ambulance.plate_number,
        role: 'ambulance',
        hospital_id: ambulance.home_hospital_id
      },
      expires_in: 900
    });

  } catch (err) {
    console.error("Ambulance Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// REFRESH TOKEN
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

  try {
    // 1. Verify token signature
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // 2. Check DB for valid token
    const { data: storedToken, error } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .single();

    if (error || !storedToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // 3. Check expiry
    if (new Date(storedToken.expires_at) < new Date()) {
      // Clean up expired
      await supabase.from('refresh_tokens').delete().eq('token', refreshToken);
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // 4. Fetch user
    const { data: user } = await supabase.from('users').select('*').eq('id', decoded.userId).single();
    if (!user) return res.status(401).json({ error: "User not found" });

    // 5. Issue new Access Token (Keep same refresh token? Or rotate? Let's keep for simplicity)
    const { accessToken } = generateTokens(user);

    res.json({ access_token: accessToken, expires_in: 900 });

  } catch (error) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
});

// LOGOUT
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await supabase.from('refresh_tokens').delete().eq('token', refreshToken);
  }

  res.json({ message: "Logged out successfully" });
});

// GET CURRENT USER profile
const { verifyToken } = require('../middleware/auth');
router.get('/me', verifyToken, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, role, entity_id, last_login')
    .eq('id', req.user.userId)
    .single();

  res.json(user);
});

module.exports = router;
