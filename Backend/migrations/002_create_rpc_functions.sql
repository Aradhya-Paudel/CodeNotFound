-- 002_create_rpc_functions.sql

-- Function to get hospitals with extracted Lat/Lon
create or replace function get_hospitals_with_coords()
returns table (
  id uuid,
  name text,
  address text,
  resources jsonb,
  lat float,
  lon float
)
language sql
as $$
  select 
    id,
    name,
    address,
    resources,
    st_y(location::geometry) as lat,
    st_x(location::geometry) as lon
  from hospitals;
$$;
