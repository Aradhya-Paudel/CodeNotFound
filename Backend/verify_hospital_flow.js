const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyHospitalFlow() {
    console.log("🚀 Starting Hospital Dashboard Verification...");

    try {
        // 1. Get Hospital ID (Simulate Login)
        console.log("\n1️⃣  Resolving 'Bir Hospital' ID...");
        const mapRes = await axios.get(`${BASE_URL}/hospitals/map`);
        const birHospital = mapRes.data.find(h => h.name === "Bir Hospital");

        if (!birHospital) {
            throw new Error("Bir Hospital not found in DB");
        }
        console.log(`✅ Found Bir Hospital: ${birHospital.id}`);

        // 2. Create Incident (Simulate Ambulance 'Got a Call' or user report)
        console.log("\n2️⃣  Creating Test Incident...");
        const incRes = await axios.post(`${BASE_URL}/incidents`, {
            title: "Test Collision",
            description: "Verification Script Test",
            location: { latitude: 27.71, longitude: 85.32 }, // Near Bir
            priority: 1
        });
        const incidentId = incRes.data.id;
        console.log(`✅ Created Incident: ${incidentId}`);

        // 3. Assign to Hospital (Simulate Match Acceptance)
        console.log("\n3️⃣  Assigning to Bir Hospital...");
        await axios.patch(`${BASE_URL}/incidents/${incidentId}`, {
            destination_hospital_id: birHospital.id,
            status: 'assigned'
        });
        console.log("✅ Incident Updated.");

        // 4. Check Hospital Incoming Feed
        console.log("\n4️⃣  Checking Incoming Feed...");
        const incomingRes = await axios.get(`${BASE_URL}/hospital/${birHospital.id}/incoming`);
        const incoming = incomingRes.data;

        const found = incoming.find(i => i.id === incidentId);

        if (found) {
            console.log("✅ Success! Incident appears in hospital incoming feed.");
            console.log("   Details:", found.title, found.status);
        } else {
            console.error("❌ Failed: Incident NOT found in incoming feed.");
            console.log("   Feed content:", incoming);
            process.exit(1);
        }

        console.log("\n✨ HOSPITAL INTEGRATION VERIFIED ✨");

    } catch (err) {
        console.error("\n❌ FATAL ERROR:", err.message);
        if (err.response) {
            console.error("   Data:", err.response.data);
        }
        process.exit(1);
    }
}

verifyHospitalFlow();
