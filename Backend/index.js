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

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Hospital Resource Backend is Running',
        endpoints: {
            health: '/health',
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
