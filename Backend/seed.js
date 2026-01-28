require('dotenv').config();
const supabase = require('./supabaseClient');

const HOSPITALS = [
    {
        name: "Bir Hospital",
        lat: 27.7052,
        lon: 85.3175,
        address: "Kantipath, Kathmandu",
        resources: { beds: 50, oxygen: 100, blood: { "O+": 20, "A+": 15 } }
    },
    {
        name: "Tribhuvan University Teaching Hospital",
        lat: 27.7360,
        lon: 85.3303,
        address: "Maharajgunj, Kathmandu",
        resources: { beds: 120, oxygen: 200, blood: { "AB+": 10, "B-": 5 } }
    },
    {
        name: "Patan Hospital",
        lat: 27.6683,
        lon: 85.3206,
        address: "Patan, Lalitpur",
        resources: { beds: 80, oxygen: 150, blood: { "O-": 5, "A+": 30 } }
    },
    {
        name: "Norvic International Hospital",
        lat: 27.6975,
        lon: 85.3196,
        address: "Thapathali, Kathmandu",
        resources: { beds: 40, oxygen: 80, blood: { "O+": 12, "B+": 18 } }
    },
    {
        name: "Grande International Hospital",
        lat: 27.7533,
        lon: 85.3264,
        address: "Dhapasi, Kathmandu",
        resources: { beds: 60, oxygen: 120, blood: { "A-": 8, "AB-": 2 } }
    }
];

async function seed() {
    console.log("🌱 Seeding Hospitals...");

    // Check if empty
    const { count, error: countErr } = await supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true });

    if (countErr) {
        console.error("Error checking table:", countErr);
        return;
    }

    if (count > 0) {
        console.log("⚠️  Table already has data. Skipping seed.");
        return;
    }

    for (const h of HOSPITALS) {
        // Insert using raw SQL or specific logic could be tricky with PostGIS via JS client INSERT if types don't match.
        // Supabase-js doesn't natively cast {lat, lon} to GEOGRAPHY column easily in .insert() unless we assume a trigger or view handle it.
        // But wait, the table column is `location` type `GEOGRAPHY(POINT)`.
        // If we send string 'SRID=4326;POINT(lon lat)', Supabase PostgREST might handle it.
        // Let's try sending WKT string.

        const { error } = await supabase.from('hospitals').insert({
            name: h.name,
            address: h.address,
            resources: h.resources,
            // PostGIS WKT format: POINT(lon lat)
            location: `SRID=4326;POINT(${h.lon} ${h.lat})`
        });

        if (error) {
            console.error(`❌ Failed to insert ${h.name}:`, error.message);
        } else {
            console.log(`✅ Inserted ${h.name}`);
        }
    }

    console.log("✨ Seed Complete.");
}

seed();
