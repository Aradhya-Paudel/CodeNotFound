const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const locationService = require('../utils/locationService');

// GET /api/hospitals/map
// Get all hospitals with map markers
router.get('/hospitals/map', async (req, res) => {
    try {
        // Query to get hospital details using PostGIS for coordinates
        const { data, error } = await supabase
            .rpc('get_hospitals_with_coords'); // Using RPC for clean PostGIS extraction

        if (error) throw error;

        if (!data) return res.json([]);

        // Helper to formatting hospital object
        const formatHospital = (h) => ({
            id: h.id,
            name: h.name,
            // Fallback if address is missing in DB
            address: h.address || "Unknown Location",
            // Map resources
            available_beds: h.resources?.beds || 0,
            icu_capacity: h.resources?.oxygen || 0,
            blood_inventory: h.resources?.blood || {},
            latitude: h.lat,
            longitude: h.lon,
            mapUrl: locationService.generateStaticMapUrl(h.lat, h.lon)
        });

        const hospitals = data.map(formatHospital);
        res.json(hospitals);

    } catch (err) {
        console.error('Error fetching hospital map data:', err.message);
        res.status(500).json({ error: 'Failed to fetch hospital map data', code: "INTERNAL_SERVER_ERROR" });
    }
});

// GET /api/hospital/:id/status
router.get('/hospital/:id/status', async (req, res) => {
    const { id } = req.params;

    try {
        // Use the RPC to get the hospital with coordinates
        // We filter for the specific ID in memory since RPC returns all close/relevant ones
        // In a larger system, we'd add an ID param to the RPC.
        const { data, error } = await supabase.rpc('get_hospitals_with_coords');

        if (error) throw error;

        const hospital = data.find(h => h.id === id);

        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found", code: "NOT_FOUND" });
        }

        const mapUrl = locationService.generateStaticMapUrl(hospital.lat, hospital.lon);
        // Only reverse geocode if address is missing to save API calls
        let reverseGeocodedAddress = hospital.address;
        if (!reverseGeocodedAddress && hospital.lat && hospital.lon) {
            reverseGeocodedAddress = await locationService.reverseGeocode(hospital.lat, hospital.lon);
        }

        res.json({
            id: hospital.id,
            name: hospital.name,
            status: "Active",
            available_beds: hospital.resources?.beds || 0,
            icu_capacity: hospital.resources?.oxygen || 0,
            blood_inventory: hospital.resources?.blood || {},
            latitude: hospital.lat,
            longitude: hospital.lon,
            mapUrl,
            reverseGeocodedAddress: reverseGeocodedAddress || hospital.address
        });

    } catch (err) {
        console.error(`Error fetching status for hospital ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to fetch hospital status', code: "INTERNAL_SERVER_ERROR" });
    }
});

// GET /api/hospitals/:id
router.get('/hospitals/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('hospitals')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "Hospital not found", code: "NOT_FOUND" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch hospital" });
    }
});

// GET /api/hospitals/:id/doctors
router.get('/hospitals/:id/doctors', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('hospital_id', id);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});


// GET /api/hospital/:id/incoming
// Get incoming ambulances/incidents for a specific hospital
router.get('/hospital/:id/incoming', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('incidents')
            .select(`
                *,
                ambulances (
                    plate_number,
                    driver_id,
                    current_location
                )
            `)
            .eq('destination_hospital_id', id)
            .in('status', ['picked_up', 'assigned']) // Only show active missions
            .neq('status', 'resolved')
            .neq('status', 'cancelled');

        if (error) throw error;

        // enrich with ETA estimation if needed (simple distance calc)
        // For now return raw data
        res.json(data);
    } catch (err) {
        console.error(`Error fetching incoming incidents for hospital ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to fetch incoming incidents', code: "INTERNAL_SERVER_ERROR" });
    }
});

module.exports = router;
