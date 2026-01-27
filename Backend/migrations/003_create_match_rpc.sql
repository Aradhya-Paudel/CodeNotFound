-- 003_create_match_rpc.sql

-- Finds the nearest hospitals with available resources
create or replace function find_best_hospital_v2(
  user_lat float,
  user_lng float,
  required_specialist text, 
  required_blood_type text,
  exclude_hospital_ids uuid[]
)
returns table (
  id uuid,
  name text,
  address text,
  resources jsonb,
  lat float,
  lon float,
  distance_meters float
)
language sql
as $$
  select 
    id,
    name,
    address,
    resources,
    st_y(location::geometry) as lat,
    st_x(location::geometry) as lon,
    st_distance(location, st_point(user_lng, user_lat)::geography) as distance_meters
  from hospitals
  where 
    -- 1. Must have Beds (checking JSONB)
    (resources->>'beds')::int > 0
    -- 2. Not in Exclude List
    and (exclude_hospital_ids is null or id <> all(exclude_hospital_ids))
  order by 
    location <-> st_point(user_lng, user_lat)::geography
  limit 8; -- Get top 8 candidates (so Node.js can check Matrix traffic for them)
$$;
