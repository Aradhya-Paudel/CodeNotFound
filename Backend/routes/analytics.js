const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { verifyToken, requireRole } = require('../middleware/auth');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware: All analytics require Admin or Dispatcher
router.use(verifyToken, requireRole(['admin', 'dispatcher']));

// GET /api/analytics/dashboard - Real-time system overview
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Active Ambulances (Mocking structure for now if table empty)
        const { count: activeTrips } = await supabase
            .from('ambulance_trips')
            .select('*', { count: 'exact', head: true })
            .in('status', ['in_transit', 'pending']);

        // 2. Hospital Capacity
        const { data: hospitals } = await supabase
            .from('hospitals')
            .select('id, name, beds_available, ambulance_count');

        const totalBeds = hospitals.reduce((acc, h) => acc + (h.beds_available || 0), 0);
        const hospitalsAtCapacity = hospitals.filter(h => (h.beds_available || 0) < 5).length;

        // 3. System Health (Mock / Real)
        // In a real app, query socket_connections table
        const { count: connections } = await supabase
            .from('socket_connections')
            .select('*', { count: 'exact', head: true });

        res.json({
            realtime: {
                activeTrips: activeTrips || 0,
                availableAmbulances: 8, // Placeholder until ambulances table fully populated
                hospitalsAtCapacity,
                networkLoad: "Normal"
            },
            today: {
                totalTrips: 145, // Placeholder/Historical
                completedTrips: 138,
                averageResponseTime: "7.3 min"
            },
            systemHealth: {
                database_status: "connected",
                active_connections: connections || 0
            }
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
});

// GET /api/analytics/trends - Historical Data (SQL View)
router.get('/trends', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('analytics_trip_summary')
            .select('*')
            .order('date', { ascending: false })
            .limit(30);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Trends Error:", error);
        res.status(500).json({ error: "Failed to fetch trends" });
    }
});

module.exports = router;
