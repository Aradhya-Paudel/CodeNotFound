const supabase = require('./supabaseClient');

async function seedAmbulances() {
    console.log("🚑 Seeding/Verifying Ambulances in Pokhara...");

    // Pokhara Center: 28.2096, 83.9856
    // We will create 5 random ambulances scattered around
    const ambulances = [
        { plate: "GA 1 CHA 1001", lat: 28.2096, lng: 83.9856 }, // Center
        { plate: "GA 1 CHA 1002", lat: 28.2150, lng: 83.9900 }, // North East
        { plate: "GA 1 CHA 1003", lat: 28.2000, lng: 83.9800 }, // South
        { plate: "GA 1 CHA 1004", lat: 28.2200, lng: 83.9700 }, // North West
        { plate: "GA 1 CHA 1005", lat: 28.2050, lng: 84.0000 }, // East
    ];

    for (const amb of ambulances) {
        // 1. Ensure Profile exists (mock user)
        // In a real app, these would be linked to Auth Users. For this MVP, we just need the row in 'ambulances'.
        // However, 'ambulances' table might not enforce driver_id FK or we can use NULL/random if schema allows.
        // Checked schema: driver_id UUID REFERENCES public.profiles(id). It might be nullable?
        // Let's check schema again? Line 64: driver_id UUID REFERENCES public.profiles(id)
        // It is nullable by default as it doesn't say NOT NULL.

        // 2. Insert/Update Ambulance
        // We need a valid home_hospital_id. Let's get one.
        const { data: hospital } = await supabase.from('hospitals').select('id').limit(1).single();
        if (!hospital) {
            console.error("❌ No hospitals found! Run previous seeds first.");
            return;
        }

        const { error } = await supabase
            .from('ambulances')
            .upsert({
                plate_number: amb.plate,
                status: 'idle',
                current_location: `SRID=4326;POINT(${amb.lng} ${amb.lat})`,
                home_hospital_id: hospital.id // Required by schema
            }, { onConflict: 'plate_number' });

        if (error) {
            console.error(`❌ Failed to seed ${amb.plate}:`, error.message);
        } else {
            console.log(`✅ Seeded ${amb.plate} at [${amb.lat}, ${amb.lng}]`);
        }
    }

    // 3. Create RPC Function (Running migration via JS wrapper for convenience)
    try {
        const fs = require('fs');
        const sql = fs.readFileSync('./migrations/005_find_nearest_ambulances_rpc.sql', 'utf8');

        // Basic execution simulation - Supabase JS client doesn't run raw SQL easily without RPC 'exec_sql'
        // We will assume the user has to run it or we rely on the previous tool writing the file.
        // BUT for this specific agent environment, I can try to use a specialized tool if available, 
        // OR just ask the user to run it. 
        // Wait, I can use my 'verify' script technique to check if RPC works, if not warns.
        console.log("\n⚠️  REMINDER: Please run 'Backend/migrations/005_find_nearest_ambulances_rpc.sql' in Supabase SQL Editor if 'find_nearest_ambulances' comes back missing.");

    } catch (e) {
        console.log(e.message);
    }
}

seedAmbulances();
