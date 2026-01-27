-- Migration Script: Single Table Hospitals Structure (Pokhara)
-- Generated on 2026-01-27T12:09:33.731Z

-- STEP 1: DROP EXISTING TABLES
DROP TABLE IF EXISTS ambulance_trips CASCADE;
DROP TABLE IF EXISTS hospital_status CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;

-- STEP 2: CREATE NEW HOSPITALS TABLE
CREATE TABLE hospitals (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  ambulance_count INTEGER NOT NULL DEFAULT 0,
  staff_count JSONB NOT NULL,
  beds_available INTEGER NOT NULL,
  total_beds INTEGER NOT NULL,
  blood_inventory JSONB NOT NULL,
  specialties TEXT[] NOT NULL,
  incoming_ambulances JSONB NOT NULL DEFAULT '[]'::jsonb,
  icu_capacity INTEGER NOT NULL,
  alerts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_hospitals_email ON hospitals(email);

-- STEP 3: SEED DATA
INSERT INTO hospitals (
  id, name, password, email, phone, address, location, 
  ambulance_count, staff_count, beds_available, total_beds, 
  blood_inventory, specialties, incoming_ambulances, icu_capacity, alerts
) VALUES
(
  1,
  'Central Medical Center',
  'hospital123',
  'admin@centralmed.com',
  '+1-555-0101',
  '123 Medical Plaza, Healthcare City, HC 12345',
  ST_SetSRID(ST_MakePoint(83.9856, 28.2096), 4326)::geography,
  12,
  '{"Trauma Surgery":45,"Cardiology":42,"Neurology":38,"Orthopedics":35,"Oncology":40,"Gastroenterology":36,"Pediatrics":34,"Psychiatry":32,"Dermatology":28,"Respiratory":37,"Urology":30,"Rheumatology":25}'::jsonb,
  50,
  56,
  '{"total":1280,"A+":450,"A-":45,"B+":320,"B-":84,"O+":560,"O-":12,"AB+":192,"AB-":65}'::jsonb,
  ARRAY['Trauma Surgery','Cardiology','Neurology','Orthopedics','Oncology','Gastroenterology','Pediatrics','Psychiatry','Dermatology','Respiratory','Urology','Rheumatology'],
  '[{"ambulanceId":"#AMB-102","caseType":"Critical Trauma","priority":1,"eta":4,"status":"Active","progress":80},{"ambulanceId":"#AMB-089","caseType":"Cardiac","priority":2,"eta":12,"status":"Stable","progress":45},{"ambulanceId":"#AMB-214","caseType":"Respiratory","priority":3,"eta":18,"status":"Urgent","progress":25}]'::jsonb,
  95,
  '[{"type":"CRITICAL","message":"ICU Capacity at 95%. Diversion protocol recommended for non-trauma cases."}]'::jsonb
),
(
  2,
  'City Hospital',
  'cityhosp456',
  'admin@cityhospital.com',
  '+1-555-0102',
  '456 Hospital Avenue, Downtown, HC 54321',
  ST_SetSRID(ST_MakePoint(83.99, 28.215), 4326)::geography,
  8,
  '{"Emergency Medicine":42,"Internal Medicine":38,"Cardiology":40,"Radiology":35,"Pathology":28,"Anesthesia":36,"Surgery":41,"Obstetrics":34,"Pediatrics":32,"Rehabilitation":24}'::jsonb,
  51,
  55,
  '{"total":950,"A+":280,"A-":35,"B+":250,"B-":60,"O+":220,"O-":25,"AB+":50,"AB-":30}'::jsonb,
  ARRAY['Emergency Medicine','Internal Medicine','Cardiology','Radiology','Pathology','Anesthesia','Surgery','Obstetrics','Pediatrics','Rehabilitation'],
  '[{"ambulanceId":"#AMB-045","caseType":"Fractured Leg","priority":2,"eta":6,"status":"In Transit","progress":60},{"ambulanceId":"#AMB-067","caseType":"Chest Pain","priority":2,"eta":9,"status":"In Transit","progress":35}]'::jsonb,
  75,
  '[{"type":"WARNING","message":"Blood inventory running low. Urgent replenishment needed for O- type."}]'::jsonb
),
(
  3,
  'Emergency Care Institute',
  'emergencycare789',
  'admin@eci.com',
  '+1-555-0103',
  '789 Emergency Lane, Relief City, HC 98765',
  ST_SetSRID(ST_MakePoint(83.98, 28.2), 4326)::geography,
  15,
  '{"Trauma Surgery":50,"Emergency Medicine":48,"Critical Care":45,"Cardiothoracic Surgery":42,"Neurosurgery":40,"Orthopedic Surgery":38,"General Surgery":42,"Vascular Surgery":35,"Burn Unit":38,"Toxicology":25,"Infectious Disease":32,"Endocrinology":28,"Nephrology":30,"Hepatology":26}'::jsonb,
  50,
  56,
  '{"total":1500,"A+":400,"A-":80,"B+":350,"B-":100,"O+":380,"O-":50,"AB+":90,"AB-":50}'::jsonb,
  ARRAY['Trauma Surgery','Emergency Medicine','Critical Care','Cardiothoracic Surgery','Neurosurgery','Orthopedic Surgery','General Surgery','Vascular Surgery','Burn Unit','Toxicology','Infectious Disease','Endocrinology','Nephrology','Hepatology'],
  '[{"ambulanceId":"#AMB-156","caseType":"Multi-Trauma","priority":1,"eta":3,"status":"Critical","progress":85},{"ambulanceId":"#AMB-178","caseType":"Burn Injury","priority":1,"eta":7,"status":"Critical","progress":50},{"ambulanceId":"#AMB-223","caseType":"Stroke","priority":1,"eta":8,"status":"Urgent","progress":40}]'::jsonb,
  85,
  '[{"type":"INFO","message":"Trauma surgery team on standby. Operating rooms prepared."}]'::jsonb
),
(
  4,
  'St. Mary''s Hospital',
  'stmary2024',
  'admin@stmaryshospital.com',
  '+1-555-0104',
  '321 Sacred Heart Ave, Holy City, HC 11223',
  ST_SetSRID(ST_MakePoint(83.975, 28.22), 4326)::geography,
  7,
  '{"Oncology":38,"Cardiology":35,"Pulmonology":32,"Gastroenterology":28,"Neurology":30,"Dermatology":22,"ENT":26,"Ophthalmology":24,"Rheumatology":20,"Immunology":18,"Nephrology":27}'::jsonb,
  53,
  55,
  '{"total":800,"A+":200,"A-":40,"B+":180,"B-":50,"O+":200,"O-":30,"AB+":60,"AB-":40}'::jsonb,
  ARRAY['Oncology','Cardiology','Pulmonology','Gastroenterology','Neurology','Dermatology','ENT','Ophthalmology','Rheumatology','Immunology','Nephrology'],
  '[{"ambulanceId":"#AMB-301","caseType":"Heart Attack","priority":1,"eta":5,"status":"Critical","progress":70}]'::jsonb,
  62,
  '[{"type":"WARNING","message":"Cardiology unit is at capacity. Some cases may need to be redirected."}]'::jsonb
),
(
  5,
  'General Hospital Network',
  'general5678',
  'admin@generalhosp.com',
  '+1-555-0105',
  '654 Healing Boulevard, Wellness County, HC 77777',
  ST_SetSRID(ST_MakePoint(84, 28.195), 4326)::geography,
  10,
  '{"General Medicine":40,"Surgery":42,"Pediatrics":36,"Obstetrics & Gynecology":38,"Psychiatry":28,"Urology":30,"ENT":26,"Orthopedics":34,"Anesthesia":35,"Radiology":32,"Pathology":25,"Microbiology":22,"Pharmacology":20}'::jsonb,
  61,
  65,
  '{"total":1100,"A+":300,"A-":50,"B+":280,"B-":70,"O+":280,"O-":40,"AB+":60,"AB-":40}'::jsonb,
  ARRAY['General Medicine','Surgery','Pediatrics','Obstetrics & Gynecology','Psychiatry','Urology','ENT','Orthopedics','Anesthesia','Radiology','Pathology','Microbiology','Pharmacology'],
  '[{"ambulanceId":"#AMB-412","caseType":"Childbirth","priority":2,"eta":10,"status":"In Transit","progress":30},{"ambulanceId":"#AMB-489","caseType":"Abdominal Pain","priority":2,"eta":15,"status":"In Transit","progress":20}]'::jsonb,
  68,
  '[{"type":"INFO","message":"OB/GYN department is fully operational. Maternity ward ready for admissions."}]'::jsonb
);

-- STEP 4: VIEWS
CREATE OR REPLACE VIEW hospitals_summary AS
SELECT 
  id, name, email, phone, address, 
  beds_available, icu_capacity, 
  location
FROM hospitals;

-- STEP 5: UPDATE FUNCTION
CREATE OR REPLACE FUNCTION find_best_hospital_v2(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  required_specialist TEXT DEFAULT NULL,
  required_blood_type TEXT DEFAULT NULL,
  exclude_hospital_ids INTEGER[] DEFAULT NULL
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  phone TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  beds_available INTEGER,
  icu_capacity INTEGER,
  specialties TEXT[],
  has_specialist BOOLEAN,
  blood_available INTEGER,
  score DOUBLE PRECISION
) AS $$
DECLARE
  search_point GEOGRAPHY;
BEGIN
  search_point := ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography;

  RETURN QUERY
  SELECT
    h.id,
    h.name,
    h.phone,
    h.address,
    ST_Y(h.location::geometry) as latitude,
    ST_X(h.location::geometry) as longitude,
    (ST_Distance(h.location, search_point) / 1000.0) as distance_km,
    h.beds_available,
    h.icu_capacity,
    h.specialties,
    CASE 
      WHEN required_specialist IS NULL THEN TRUE
      ELSE required_specialist = ANY(h.specialties)
    END as has_specialist,
    CASE
      WHEN required_blood_type IS NULL THEN 100 -- Dummy value if not checked
      ELSE COALESCE((h.blood_inventory->>required_blood_type)::INTEGER, 0)
    END as blood_available,
    -- Simple Scoring Logic (can be tuned)
    (
      (h.beds_available * 0.5) + 
      (CASE WHEN required_specialist = ANY(h.specialties) THEN 50 ELSE 0 END) - 
      ((ST_Distance(h.location, search_point) / 1000.0) * 2)
    ) as score
  FROM hospitals h
  WHERE 
    h.beds_available > 0
    AND (exclude_hospital_ids IS NULL OR NOT (h.id = ANY(exclude_hospital_ids)))
    AND (
      required_blood_type IS NULL 
      OR (h.blood_inventory->>required_blood_type)::INTEGER > 0
    )
    AND (
      required_specialist IS NULL
      OR required_specialist = ANY(h.specialties)
    )
  ORDER BY 
    score DESC;
END;
$$ LANGUAGE plpgsql;
