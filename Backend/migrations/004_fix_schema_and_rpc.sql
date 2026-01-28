-- 004_fix_schema_and_rpc.sql

-- 1. Ensure 'incidents' table has AI and dispatch columns
-- We use DO blocks to safely add columns if they are missing
DO $$ 
BEGIN
    -- AI Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incidents' AND column_name = 'ai_severity') THEN
        ALTER TABLE incidents ADD COLUMN ai_severity TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incidents' AND column_name = 'ai_analysis') THEN
        ALTER TABLE incidents ADD COLUMN ai_analysis TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incidents' AND column_name = 'ai_ambulance_type') THEN
        ALTER TABLE incidents ADD COLUMN ai_ambulance_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incidents' AND column_name = 'image_url') THEN
        ALTER TABLE incidents ADD COLUMN image_url TEXT;
    END IF;

    -- Dispatch Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incidents' AND column_name = 'destination_hospital_id') THEN
        ALTER TABLE incidents ADD COLUMN destination_hospital_id UUID REFERENCES hospitals(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incidents' AND column_name = 'assigned_ambulance_id') THEN
        ALTER TABLE incidents ADD COLUMN assigned_ambulance_id UUID REFERENCES ambulances(id);
    END IF;
END $$;

-- 2. Create the 'find_nearest_hospitals' RPC function required by Smart Dispatch
CREATE OR REPLACE FUNCTION find_nearest_hospitals(
  lat float,
  lng float,
  lim int default 5
)
RETURNS TABLE (
  id uuid,
  name text,
  location geography,
  dist_meters float
)
LANGUAGE sql
AS $$
  SELECT
    id,
    name,
    location,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) as dist_meters
  FROM
    hospitals
  ORDER BY
    location <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  LIMIT lim;
$$;
