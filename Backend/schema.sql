-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    phone TEXT,
    total_beds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create hospital_status table
CREATE TABLE IF NOT EXISTS hospital_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID UNIQUE NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    available_beds INTEGER NOT NULL DEFAULT 0,
    blood_inventory JSONB NOT NULL DEFAULT '{}',
    specialists TEXT[] NOT NULL DEFAULT '{}',
    severity_capacity TEXT[] NOT NULL DEFAULT '{}',
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- Create index on location
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals USING GIST(location);

-- Seed Data (Dummy Hospitals in Kathmandu)
INSERT INTO hospitals (name, address, location, phone, total_beds)
VALUES 
    (
        'Kathmandu Medical College', 
        'Sinamangal, Kathmandu', 
        ST_SetSRID(ST_MakePoint(85.3560, 27.6931), 4326)::geography, 
        '+977-1-4469064', 
        500
    ),
    (
        'Bir Hospital', 
        'Kantipath, Kathmandu', 
        ST_SetSRID(ST_MakePoint(85.3146, 27.7042), 4326)::geography, 
        '+977-1-4221119', 
        400
    ),
    (
        'Grande International Hospital', 
        'Tokha Rd, Kathmandu', 
        ST_SetSRID(ST_MakePoint(85.3265, 27.7496), 4326)::geography, 
        '+977-1-5159266', 
        200
    );

-- Seed Status Data (Linking to created hospitals)
-- Note: In a real migration, we might not know the UUIDs. 
-- For a raw SQL script run in editor, we can use DO block or CTE, but keeping it simple for now.
-- We will just insert status validation logic or assumption that this is run once on fresh DB.
-- Here is a query to insert status for all existing hospitals that don't have status yet
INSERT INTO hospital_status (hospital_id, available_beds, blood_inventory, specialists, severity_capacity)
SELECT 
    id, 
    floor(random() * 50 + 10)::int as available_beds,
    '{"A+": 10, "B-": 5, "O+": 20}'::jsonb as blood_inventory,
    ARRAY['Cardiologist', 'Neurologist'] as specialists,
    ARRAY['Severe', 'Critical'] as severity_capacity
FROM hospitals
WHERE id NOT IN (SELECT hospital_id FROM hospital_status);
