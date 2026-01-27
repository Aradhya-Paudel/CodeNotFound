# System Architecture & Integration Plan

## 1. Validated Backend Architecture (Status: ✅ Active)
The system currently runs on a robust Node.js/Express + Supabase (PostgreSQL) architecture, designed for reliability and scalability.

**Core Components:**
*   **Database**: Supabase PostgreSQL with PostGIS extensions for geospatial logic.
*   **API Layer**: Express.js REST API on Port 5000.
*   **AI Layer**: OpenRouter (Qwen-VL + Gemma 3) for vision analysis and reasoning.
*   **Real-time**: Polling (MVP) & Socket.IO (ready for Dispatch).

## 2. Database Schema (Clean & Production-Ready)
The schema is designed to enforce data integrity and rapid geospatial queries.

### **Core Tables**
*   `profiles` (user_id [PK], role, name, phone) - Links to Supabase Auth.
*   `hospitals` (id [PK], location [GEOGRAPHY], resources [JSONB], admin_id [FK])
    *   *Resources JSON*: `{"beds": 50, "icu": 5, "blood": {"A+": 10, "O-": 2}}`
*   `incidents` (id [PK], status, location [GEOGRAPHY], description, assigned_ambulance_id [FK])
*   `ambulances` (id [PK], current_location [GEOGRAPHY], status, driver_id [FK])

### **Relations**
*   `incidents.assigned_ambulance_id` -> `ambulances.id`
*   `incidents.destination_hospital_id` -> `hospitals.id`
*   `ambulances.home_hospital_id` -> `hospitals.id` (Fleet Management)

## 3. API Contracts

### **Guest Flow (Zero Friction)**
*   **`POST /api/incidents`**
    *   **Input**: `{ image: "base64...", location: { lat, lng }, userAgent: "..." }`
    *   **Process**:
        1.  **AI Analysis**: Qwen-VL extracts severity, casualties, hazards.
        2.  **Geocoding**: Validates coordinates (prevents spoofing via server-side check if needed).
        3.  **Creation**: Inserts into `incidents` with status 'pending'.
    *   **Output**: `{ success: true, incidentId: "uuid", aiAnalysis: { ... } }`

### **Ambulance Flow**
*   **`GET /api/incidents/assigned`**: Fetches incidents assigned to the logged-in driver.
*   **`PATCH /api/incidents/:id`**: Updates status ('en_route', 'picked_up', 'arrived').
*   **`PATCH /api/ambulance/location`**: Sends real-time GPS updates (every 5s).

### **Hospital Flow**
*   **`GET /api/hospital/:id/incoming`**: Real-time feed of ambulances headed to the facility.
*   **`POST /api/ai/explain`**: Request explanation for why *this* hospital was chosen (Explainable AI).

## 4. GPS Validation (Webhook Logic)
To prevent "fake location" attacks in the Guest App:
1.  **Browser Check**: Backend verifies `userAgent` and `isSecureContext`.
2.  **Geofencing**: Server-side PostGIS check `ST_Contains(Nepal_Polygon, point)`.
3.  **Distance Speed Check**: If a user posts from Kathmandu and 1 min later from Pokhara, flag as suspicious (impossible velocity).
4.  **Metadata**: Extract EXIF GPS data from the uploaded photo (if available) and compare with the browser Geolocation API. (Future Enhancement).

## 5. Optimization Logic (Pseudo-Code)
The upgraded `find_best_hospital_v2` RPC function implements the following:

```sql
SELECT hospital
FROM hospitals
WHERE 
  distance < 50km
  AND resources->'beds' > 0 
  AND resources->'blood'->[PatientBloodType] > 0
  AND resources->'trauma_level' >= [IncidentSeverity]
ORDER BY
  (distance_weight * distance) + 
  (resource_weight * (1 / available_beds))
LIMIT 3
```
*Current Implementation*: Checks Distance + Bed Availability + Blood Availability.

## 6. Risks & Edge Cases
*   **Network Latency**: AI analysis takes 5-10s. **Mitigation**: The API returns success *immediately* (async processing) or frontend shows a spinner. Currently, we wait for AI to ensure data quality.
*   **Offline Mode**: Ambulances might lose signal. **Mitigation**: App should cache actions and sync when online (PWA capabilities).
*   **AI Hallucination**: Model might overestimate casualties. **Mitigation**: "AI Confidence Score" displayed; Human (Ambulance Driver) must confirm data.

## 7. Next Steps for Developer
1.  **Test**: Open `/guest`, take a photo, confirm it appears in Supabase `incidents`.
2.  **Visuals**: Ensure Hospital Dashboard shows the "AI Analysis" text in the incident card.
3.  **Demo**: Record the flow: Guest -> AI Analysis -> Ambulance Dispatch -> Hospital View.
