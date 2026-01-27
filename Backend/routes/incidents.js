const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// UPDATE INCIDENT
// PATCH /api/incidents/:id
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Allowed fields to update
    const allowed = ['status', 'destination_hospital_id', 'ambulance_id'];
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
        if (allowed.includes(key)) filteredUpdates[key] = updates[key];
    });

    try {
        const { data, error } = await supabase
            .from('incidents')
            .update(filteredUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error(`Error updating incident ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to update incident' });
    }
});

// CREATE INCIDENT (For "Got a Call" manual entry)
// POST /api/incidents
router.post('/', async (req, res) => {
    const { title, location, description, reported_by, priority } = req.body;

    try {
        const { data, error } = await supabase
            .from('incidents')
            .insert([{
                title: title || 'Emergency Request',
                description,
                location: `SRID=4326;POINT(${location.longitude} ${location.latitude})`,
                status: 'pending',
                // priority isn't in schema yet, maybe add later or put in description
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);

    } catch (err) {
        console.error(`Error creating incident:`, err);
        res.status(500).json({ error: 'Failed to create incident', details: err.message });
    }
});

module.exports = router;
