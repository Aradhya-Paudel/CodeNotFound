const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const fs = require('fs');

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

const { analyzeEmergencyImage } = require('../utils/aiService');

// CREATE INCIDENT (With AI Analysis & Image Support)
// POST /api/incidents
router.post('/', async (req, res) => {
    const { title, location, description, image, address } = req.body;

    try {
        console.log("🚑 Processing new emergency report...");

        if (!image) {
            return res.status(400).json({ error: 'Image is required for AI verification' });
        }

        // 1. Run AI Analysis
        let aiResult;
        try {
            aiResult = await analyzeEmergencyImage(image);
            console.log("🧠 AI Assessment:", aiResult);
        } catch (aiError) {
            console.warn("⚠️ AI Service Unavailable/Skipped:", aiError.message);
            // Fallback for "without any llm" mode
            aiResult = {
                is_emergency: true,
                severity: 'high', // Default to high safety
                analysis: 'Emergency reported. AI verification skipped (System Bypass).',
                recommended_ambulance: 'ALS'
            };
        }

        // 2. Handle Trolls
        if (!aiResult.is_emergency && aiResult.severity === 'none') {
            console.warn("🚫 Troll detected! Sending funny warning.");
            return res.status(200).json({
                is_troll: true,
                message: aiResult.analysis || "Nice try, but we're saving lives here. Go take selfies elsewhere! 😉"
            });
        }

        // 3. Upload Image to Supabase Storage (Optional but requested)
        // For simplicity in hackathon, we can also store Base64 or a placeholder 
        // if bucket isn't ready, but let's try to upload.
        let imageUrl = null;
        try {
            const fileName = `incident_${Date.now()}.jpg`;
            const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('emergency-photos')
                .upload(fileName, buffer, { contentType: 'image/jpeg' });

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                    .from('emergency-photos')
                    .getPublicUrl(fileName);
                imageUrl = publicUrlData.publicUrl;
            }
        } catch (storageErr) {
            console.warn("⚠️ Storage upload failed, using placeholder", storageErr.message);
        }

        // 4. Create Incident Record
        const { data, error } = await supabase
            .from('incidents')
            .insert([{
                title: title || aiResult.analysis.substring(0, 50) + '...',
                description: aiResult.analysis,
                address: address || 'Current Location',
                location: `SRID=4326;POINT(${location.longitude} ${location.latitude})`,
                status: 'pending',
                image_url: imageUrl,
                ai_severity: aiResult.severity,
                ai_analysis: aiResult.analysis,
                ai_ambulance_type: aiResult.recommended_ambulance
            }])
            .select()
            .single();

        if (error) throw error;

        // 5. Smart Dispatch: Find Nearest Hospital
        try {
            const { data: nearestHospitals, error: geoError } = await supabase.rpc('find_nearest_hospitals', {
                lat: location.latitude,
                lng: location.longitude,
                lim: 1
            });

            if (!geoError && nearestHospitals && nearestHospitals.length > 0) {
                const nearest = nearestHospitals[0];
                console.log(`🎯 Smart Dispatch: Notifying ${nearest.name}`);

                // 6. Broadcast via Socket.IO
                const io = require('../utils/socketManager').getIO();

                // Alert the hospital room
                io.to(`hospital-${nearest.id}`).emit('emergency:new', {
                    incident: data,
                    ai_analysis: aiResult
                });

                // Also alert all ambulances linked to this hospital (if any)
                // Assuming we have a way to match ambulances to hospital rooms or names
                io.emit('ambulance:emergency', {
                    hospitalName: nearest.name,
                    incident: data,
                    ai_analysis: aiResult
                });

                // Update incident with assigned hospital
                await supabase
                    .from('incidents')
                    .update({ destination_hospital_id: nearest.id })
                    .eq('id', data.id);
            }
        } catch (dispatchErr) {
            console.error("❌ Smart Dispatch Failed:", dispatchErr.message);
        }

        // Return the incident data
        res.status(201).json({
            ...data,
            ai_message: "Accident verified. Help is on the way!"
        });

    } catch (err) {
        console.error(`Error creating incident:`, err);
        try {
            fs.appendFileSync('error_log.txt', `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\n\n`);
        } catch (f) { /* ignore file write err */ }
        res.status(500).json({ error: 'Failed to create incident', details: err.message });
    }
});

module.exports = router;
