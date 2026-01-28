const supabase = require('./supabaseClient');

async function verifyDatabaseParams() {
    console.log("🔍 Verifying Database Schema & RPC...");

    // 1. Check if 'incidents' table has the new columns
    // We can't describe table easily with JS client, but we can try to insert a dummy row and rollback, or just check RPC.

    // 2. Test 'find_nearest_hospitals' RPC
    const { data, error } = await supabase.rpc('find_nearest_hospitals', {
        lat: 28.2096,
        lng: 83.9856,
        lim: 1
    });

    if (error) {
        console.error("❌ RPC 'find_nearest_hospitals' failed or missing:");
        console.error(error.message);
        console.log("\n⚠️  ACTION REQUIRED: You need to run the SQL migration to create this function.");
        console.log("   Open 'Backend/migrations/004_fix_schema_and_rpc.sql' and run it in your Supabase SQL Editor.");
    } else {
        console.log("✅ RPC 'find_nearest_hospitals' is WORKING.");
        console.log("   Result:", data);

        // 3. Check for specific columns by doing a select limit 1
        const { data: inc, error: incErr } = await supabase
            .from('incidents')
            .select('ai_analysis, image_url')
            .limit(1);

        if (incErr) {
            // If error contains "column does not exist", we know.
            console.log("❌ 'incidents' table might be missing columns:", incErr.message);
        } else {
            console.log("✅ 'incidents' table columns appear correct.");
        }
    }
}

verifyDatabaseParams();
