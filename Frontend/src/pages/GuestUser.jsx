import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default leaflet icon issues in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map when location changes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);
  return null;
}

function GuestUser() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [nearestAmbulance, setNearestAmbulance] = useState(null);

  const LOCATIONIQ_KEY = "pk.2dffe0ac9cdf00d5bc415affee280a47";

  useEffect(() => {
    // Get location immediately
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Location error:", err)
      );
    }

    // Load hospitals for nearest calculation
    fetch("/hospitals.json")
      .then(res => res.json())
      .then(data => setHospitals(data.hospitals || []))
      .catch(err => console.error("Error loading hospitals:", err));
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearest = (userLat, userLng) => {
    if (hospitals.length === 0) return;

    let nearest = null;
    let minDistance = Infinity;

    // In a real app, we'd fetch actual ambulance locations. 
    // Here we simulate by checking hospitals (which have ambulances).
    hospitals.forEach(h => {
      // Mocking hospital coords if not in JSON (Pokhara locations)
      const hLat = h.name === "Gandaki Medical College" ? 28.2109 : 28.2200;
      const hLng = h.name === "Gandaki Medical College" ? 83.9873 : 84.0000;

      const dist = calculateDistance(userLat, userLng, hLat, hLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { ...h, distance: dist.toFixed(2) };
      }
    });
    setNearestAmbulance(nearest);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied");
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    setCapturedImage(canvasRef.current.toDataURL("image/png"));
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);

    // Find nearest ambulance upon capture
    if (location) findNearest(location.lat, location.lng);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCapturedImage(ev.target.result);
        if (location) findNearest(location.lat, location.lng);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitIncident = async () => {
    if (!capturedImage || !location) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Get readable address (Optional, using OpenStreetMap)
      let readableLocation = "Unknown Location";
      try {
        const revGeo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`);
        const revData = await revGeo.json();
        readableLocation = revData.display_name;
      } catch (e) {
        console.warn("Reverse geocode failed");
      }

      // 2. Submit to Backend
      const response = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Emergency Alert",
          description: "Accident reported via guest portal.",
          location: { latitude: location.lat, longitude: location.lng },
          address: readableLocation,
          image: capturedImage
        })
      });

      const data = await response.json();

      if (data.is_troll) {
        // AI detected a prank!
        setError(data.message || "AI detected a prank! Please don't misuse emergency services.");
        setLoading(false);
        return;
      }

      if (response.ok) {
        setSubmitted(true);
        // After successful submission, we can show the AI analysis
        setNearestAmbulance({
          name: data.ai_analysis || "Verifying nearest unit...",
          distance: "Real-time"
        });
      } else {
        throw new Error(data.error || "Failed to submit report");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("System is busy. Please call emergency services directly if this is urgent.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-green-600 text-6xl">check_circle</span>
        </div>
        <h1 className="text-3xl font-black text-green-900">Emergency Dispatched!</h1>
        <p className="text-green-700 mt-2 font-bold">The nearest unit from {nearestAmbulance?.name} is on the way.</p>
        <button onClick={() => navigate("/")} className="mt-10 px-8 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-display flex flex-col max-w-lg mx-auto shadow-2xl">
      <header className="p-6 bg-white border-b flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
            <span className="material-symbols-outlined">e911_emergency</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Public Emergency</h1>
        </div>
        <button onClick={() => navigate("/")} className="text-slate-400 font-bold hover:text-red-500">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Photo Section */}
        <section className="bg-white rounded-[2rem] shadow-sm border p-4 space-y-4">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden ring-1 ring-slate-200">
            {!capturedImage ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-[0.3]" />
                {!stream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl opacity-20">cloud_upload</span>
                    <p className="font-bold opacity-50">Upload accident photo for immediate dispatch</p>
                    <div className="flex gap-3">
                      <button onClick={startCamera} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">camera</span>
                        Open Camera
                      </button>
                      <label className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">upload</span>
                        Upload
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                )}
                {stream && (
                  <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-600 rounded-full border-4 border-white shadow-2xl active:scale-90 transition-transform" />
                )}
              </>
            ) : (
              <img src={capturedImage} className="w-full h-full object-cover" />
            )}
            {capturedImage && (
              <button onClick={() => { setCapturedImage(null); startCamera(); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md">
                <span className="material-symbols-outlined">refresh</span>
              </button>
            )}
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-white rounded-[2rem] shadow-sm border p-4 space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">Live Location</h3>
          <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden ring-1 ring-slate-100 relative">
            {location ? (
              <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`} />

                {/* User Marker */}
                <Marker position={[location.lat, location.lng]}>
                  <Popup>You are here</Popup>
                </Marker>

                {/* Hospital Markers */}
                {hospitals.map(h => {
                  // Using fixed coords for Pokhara hospitals as demonstration
                  const hCoords = h.name === "Gandaki Medical College" ? [28.2109, 83.9873] :
                    h.name === "Manipal Teaching Hospital" ? [28.2200, 84.0000] :
                      h.name === "Pokhara Academy of Health Sciences" ? [28.2163, 83.9912] :
                        h.name === "Metrocity Hospital" ? [28.2115, 83.9774] :
                          [28.2150, 83.9850];

                  return (
                    <Marker
                      key={h.id}
                      position={hCoords}
                      icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style='background-color: white; padding: 4px; border-radius: 8px; border: 2px solid ${nearestAmbulance?.id === h.id ? '#ef4444' : '#64748b'}; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'><span class="material-symbols-outlined" style="font-size: 20px; color: ${nearestAmbulance?.id === h.id ? '#ef4444' : '#64748b'}">local_hospital</span></div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                      })}
                    >
                      <Popup>
                        <div className="font-display">
                          <p className="font-black text-slate-800">{h.name}</p>
                          <p className="text-xs text-slate-500">{h.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                <RecenterMap position={[location.lat, location.lng]} />
              </MapContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-slate-300">progress_activity</span>
              </div>
            )}
          </div>
        </section>

        {/* Dispatch Info */}
        {nearestAmbulance && (
          <section className="bg-red-50 rounded-[2rem] p-6 border-2 border-red-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                <span className="material-symbols-outlined">ambulance</span>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-red-900 leading-tight">Nearest Unit Detected</h4>
                <p className="text-sm font-bold text-red-700 mt-1">{nearestAmbulance.name}</p>
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[12px]">distance</span>
                  Approximately {nearestAmbulance.distance} km away
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="p-6 bg-white border-t">
        <canvas ref={canvasRef} width="640" height="480" className="hidden" />
        <button
          disabled={!capturedImage || loading}
          onClick={submitIncident}
          className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl shadow-red-200"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <>
              <span>REPORT ACCIDENT</span>
              <span className="material-symbols-outlined">campaign</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}

export default GuestUser;
