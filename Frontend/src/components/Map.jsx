import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom ambulance icon
const ambulanceIcon = new L.DivIcon({
  className: "ambulance-marker",
  html: `
    <div style="
      background: #1e40af;
      padding: 10px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span class="material-symbols-outlined" style="color: white; font-size: 22px;">ambulance</span>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});

// Custom incident icon
const createIncidentIcon = () => {
  return new L.DivIcon({
    className: "incident-marker",
    html: `
      <div style="
        background: #dc2626;
        padding: 8px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <span class="material-symbols-outlined" style="color: white; font-size: 18px;">emergency</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Component to handle map center updates
function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 18, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

function Map({
  ambulanceLocation,
  ambulanceName,
  incidents = [],
  routePoints = [],
}) {
  const [route, setRoute] = useState([]);

  // Use ambulance location as center, fallback to Kathmandu
  const defaultCenter = ambulanceLocation
    ? [ambulanceLocation.latitude, ambulanceLocation.longitude]
    : [28.224896, 83.976983]; // Kathmandu fallback

  console.log("Map Center (defaultCenter):", defaultCenter);

  // Calculate route from ambulance to nearest incident using OSRM
  useEffect(() => {
    const calculateRouteWithOSRM = async () => {
      if (!ambulanceLocation || incidents.length === 0) {
        setRoute([]);
        return;
      }

      const ambulancePos = [
        ambulanceLocation.longitude, // OSRM uses [lng, lat]
        ambulanceLocation.latitude,
      ];

      // Find nearest incident
      let nearestIncident = null;
      let minDistance = Infinity;

      incidents.forEach((incident) => {
        if (incident.latitude && incident.longitude) {
          const distance = Math.sqrt(
            Math.pow(incident.latitude - ambulanceLocation.latitude, 2) +
              Math.pow(incident.longitude - ambulanceLocation.longitude, 2),
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestIncident = incident;
          }
        }
      });

      if (!nearestIncident) {
        setRoute([]);
        return;
      }

      const incidentPos = [
        nearestIncident.longitude, // OSRM uses [lng, lat]
        nearestIncident.latitude,
      ];

      try {
        // Use OSRM public API for routing
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${ambulancePos[0]},${ambulancePos[1]};${incidentPos[0]},${incidentPos[1]}?overview=full&geometries=geojson`;

        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const routeCoordinates = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng], // Convert back to [lat, lng] for Leaflet
          );
          setRoute(routeCoordinates);
        } else {
          setRoute([]);
        }
      } catch (error) {
        console.error("Error fetching OSRM route:", error);
        // Fallback to straight line if OSRM fails
        setRoute([
          [ambulanceLocation.latitude, ambulanceLocation.longitude],
          [nearestIncident.latitude, nearestIncident.longitude],
        ]);
      }
    };

    calculateRouteWithOSRM();
  }, [ambulanceLocation, incidents]);

  const mapCenter = ambulanceLocation
    ? [ambulanceLocation.latitude, ambulanceLocation.longitude]
    : defaultCenter;

  return (
    <div
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          .leaflet-container {
            width: 100%;
            height: 100%;
            z-index: 1;
          }
        `}
      </style>
      <MapContainer
        center={defaultCenter}
        zoom={18}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map center when ambulance location changes */}
        <MapCenterUpdater center={ambulanceLocation ? mapCenter : null} />

        {/* Ambulance Marker */}
        {ambulanceLocation && (
          <Marker
            position={[ambulanceLocation.latitude, ambulanceLocation.longitude]}
            icon={ambulanceIcon}
          >
            <Popup>
              <div style={{ padding: "4px" }}>
                <strong style={{ color: "#1e40af" }}>
                  🚑 {ambulanceName || "Ambulance"}
                </strong>
                <br />
                <span style={{ fontSize: "11px", color: "#666" }}>
                  Lat: {ambulanceLocation.latitude.toFixed(6)}
                  <br />
                  Lng: {ambulanceLocation.longitude.toFixed(6)}
                  <br />
                  Accuracy: ±{ambulanceLocation.accuracy?.toFixed(1) || "N/A"}m
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident Markers */}
        {incidents.map((incident) => {
          if (!incident.latitude || !incident.longitude) return null;

          return (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={createIncidentIcon()}
            >
              <Popup>
                <div style={{ padding: "4px", minWidth: "180px" }}>
                  <strong style={{ color: "#dc2626" }}>
                    🚨 {incident.title || "Incident"}
                  </strong>
                  <br />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    📍 {incident.location || "Unknown location"}
                    <br />
                    🕐 {incident.time || "Unknown time"}
                    <br />
                    Status: <strong>{incident.status || "PENDING"}</strong>
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Line */}
        {route.length >= 2 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#1e40af",
              weight: 4,
              opacity: 0.8,
              dashArray: "10, 10",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
