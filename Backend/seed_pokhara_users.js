const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
    try {
        const hospitals = JSON.parse(fs.readFileSync(path.join(__dirname, 'USER', 'hospital_auth.json'), 'utf8'));
        const ambulanceData = JSON.parse(fs.readFileSync(path.join(__dirname, 'USER', 'ambulance_auth.json'), 'utf8'));

        console.log("Re-seeding Pokhara Users with individual passwords...");

        // 1. Seed Hospital Admins
        for (const h of hospitals) {
            const email = h.gmail;
            const username = h.username;
            const hashedPassword = await bcrypt.hash(h.password, 10);

            const { data, error } = await supabase
                .from('users')
                .upsert({
                    email: email,
                    username: username,
                    password_hash: hashedPassword,
                    role: 'hospital',
                    entity_id: h.id,
                    is_active: true
                }, { onConflict: 'email' });

            if (error) console.error(`Failed to seed hospital ${email}:`, error.message);
            else console.log(`Seeded hospital admin: ${email}`);
        }

        // 2. Seed Ambulance Units with individual passwords
        for (const hBase of ambulanceData) {
            for (const amb of hBase.ambulances) {
                const plate = amb.plate;
                const email = `${plate.replace(/\s+/g, '').toLowerCase()}@ambulance.com`;
                const username = plate.replace(/\s+/g, '').toLowerCase();
                // Use individual ambulance password if it exists, fallback to hospital base password
                const hashedPassword = await bcrypt.hash(amb.password || hBase.auth.password, 10);

                const { data, error } = await supabase
                    .from('users')
                    .upsert({
                        email: email,
                        username: username,
                        password_hash: hashedPassword,
                        role: 'ambulance',
                        entity_id: plate,
                        is_active: true
                    }, { onConflict: 'email' });

                if (error) console.error(`Failed to seed ambulance ${email}:`, error.message);
                else console.log(`Seeded ambulance unit: ${email} (Pass: ${amb.password || 'base'})`);
            }
        }

        console.log("Re-seeding Completed Successfully!");
    } catch (err) {
        console.error("Seeding Error:", err);
    }
}

seed();
