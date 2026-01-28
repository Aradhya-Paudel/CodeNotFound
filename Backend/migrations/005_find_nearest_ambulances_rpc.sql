-- 005_find_nearest_ambulances_rpc.sql

-- 1. Create RPC to find nearest ambulances
CREATE OR REPLACE FUNCTION find_nearest_ambulances(
  lat float,
  lng float,
  lim int default 5
)
RETURNS TABLE (
  id uuid,
  plate_number text,
  status ambulance_status,
  location geography,
  dist_meters float,
  driver_id uuid
)
LANGUAGE sql
AS $$
  SELECT
    id,
    plate_number,
    status,
    current_location,
    ST_Distance(current_location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) as dist_meters,
    driver_id
  FROM
    ambulances
  WHERE
    status = 'idle'  -- Only idle ambulances
    AND current_location IS NOT NULL
  ORDER BY
    current_location <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  LIMIT lim;
$$;
