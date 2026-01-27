const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const locationService = require('../utils/locationService');
const rateLimiter = require('../middleware/rateLimiter');

// POST /api/match
// Match Best Hospital (Intelligent Logic)
router.post('/match', rateLimiter, async (req, res) => {
    let { latitude, longitude, address, injuryType, bloodType, excludeIds } = req.body;

    // 1. Resolve Coordinates
    if ((!latitude || !longitude) && address) {
        const geoResult = await locationService.geocodeAddress(address);
        if (geoResult) {
            latitude = geoResult.latitude;
            longitude = geoResult.longitude;
        } else {
            return res.status(400).json({ error: "Address could not be geocoded." });
        }
    }

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Location required." });
    }

    try {
        // 1. Initial Filter (Database Logic - PostGIS)
        // Using simplified RPC to ensure compatibility
        const { data: candidatesRaw, error } = await supabase.rpc('find_best_hospital_simple', {
            user_lat: Number(latitude),
            user_lng: Number(longitude)
        });

        if (error) throw error;

        // Filter excluded hospitals in memory
        let candidates = candidatesRaw;
        if (excludeIds && excludeIds.length > 0) {
            candidates = candidates.filter(h => !excludeIds.includes(h.id));
        }

        if (error) throw error;
        if (!candidates || candidates.length === 0) {
            return res.json({ success: true, matches: [] });
        }

        // 3. Traffic Analysis (Intelligence Layer - LocationIQ)
        // Get real-world driving times for these candidates
        const travelTimes = await locationService.getTravelTimes(latitude, longitude, candidates);

        let finalMatches = candidates.map(h => {
            const matrixInfo = travelTimes ? travelTimes.find(t => t.id === h.id) : null;
            return {
                ...h,
                duration_seconds: matrixInfo ? matrixInfo.duration : null,
                // If matrix fails, fallback to rough 60km/h estimate (16.6 m/s)
                estimated_duration: matrixInfo ? matrixInfo.duration : (h.distance_meters / 16.6)
            };
        });

        // 4. Sort by TIME (Critical for 10/10 System)
        finalMatches.sort((a, b) => a.estimated_duration - b.estimated_duration);

        // 5. Enhance Response (Map Routes)
        const bestMatch = finalMatches[0];
        const routeData = await locationService.getRoute(
            latitude, longitude,
            bestMatch.lat, bestMatch.lon
        );

        // Add display properties
        const responseData = finalMatches.map((h, index) => ({
            hospital_id: h.id,
            name: h.name,
            address: h.address,
            available_beds: h.resources?.beds || 0,
            distance_km: (h.distance_meters / 1000).toFixed(2),
            duration_mins: Math.round(h.estimated_duration / 60),
            is_best_match: index === 0,
            location: { lat: h.lat, lon: h.lon },
            route_geometry: index === 0 ? routeData?.geometry : null
        }));

        res.json({
            success: true,
            matches: responseData
        });

    } catch (err) {
        console.error('Matching Engine Error:', err);
        res.status(500).json({ error: 'Matching failed', details: err.message });
    }
});

module.exports = router;
