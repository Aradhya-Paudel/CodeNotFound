require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/health', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hospitals').select('count', { count: 'exact', head: true });
        if (error) throw error;
        res.json({ status: 'healthy', dbConnection: 'connected' });
    } catch (err) {
        console.error('Health Check Failed:', err.message);
        res.status(503).json({ status: 'unhealthy', dbConnection: 'disconnected', error: err.message });
    }
});

// Get All Hospitals (Summary View)
app.get('/api/hospitals', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hospitals_summary').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching hospitals:', err.message);
        res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
});

/**
 * Match Best Hospital
 * POST /api/match
 * Body: { latitude, longitude, injuryType, bloodType, excludeIds }
 */
app.post('/api/match', async (req, res) => {
    const { latitude, longitude, injuryType, bloodType, excludeIds } = req.body;

    // Validate inputs
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    try {
        const { data, error } = await supabase.rpc('find_best_hospital_v2', {
            user_lat: parseFloat(latitude),
            user_lng: parseFloat(longitude),
            required_specialist: injuryType || null,
            required_blood_type: bloodType || null,
            exclude_hospital_ids: excludeIds || null
        });

        if (error) throw error;

        res.json({
            success: true,
            matches: data || []
        });

    } catch (err) {
        console.error('Matching Error:', err.message);
        res.status(500).json({
            success: false,
            error: 'Failed to match hospital',
            details: err.message
        });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Hospital Resource Backend is Running',
        endpoints: {
            health: '/health',
            hospitals: '/api/hospitals',
            match: '/api/match'
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start Server
app.listen(port, () => {
    console.log(`\n---------------------------------------------------`);
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Supabase Connection Initialized`);
    console.log(`---------------------------------------------------\n`);
});
