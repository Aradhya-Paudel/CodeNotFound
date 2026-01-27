import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";

function AmbulanceUser() {
  const navigate = useNavigate();
  // State for data
  const [user, setUser] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Location & Navigation State
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationError, setLocationError] = useState(null);
  const [distanceInMeters, setDistanceInMeters] = useState(null);

  // Workflow State
  const [ambulanceStatus, setAmbulanceStatus] = useState("active");
  const [currentIncident, setCurrentIncident] = useState(null);
  const [nearestIncident, setNearestIncident] = useState(null);

  // Casualty Flow
  const [showCasualtyPopup, setShowCasualtyPopup] = useState(false);
  const [casualtyCount, setCasualtyCount] = useState(0);
  const [casualties, setCasualties] = useState([]);

  // Hospital Navigation
  const [nearestHospital, setNearestHospital] = useState(null);
  const [isNavigatingToHospital, setIsNavigatingToHospital] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState(null);

  const PROXIMITY_THRESHOLD = 50; // increased threshold for real GPS variance

  // Initial Data Fetch
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const isAuth = localStorage.getItem("adminAuth");

    if (!isAuth || !userName) {
      navigate("/", { replace: true });
      return;
    }
    setUser(userName);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [incidentsData, hospitalsData] = await Promise.all([
          api.get('/submissions', { silent: true }).catch(() => ({ submissions: [] })),
          api.get('/hospitals/map', { silent: true }).catch(() => [])
        ]);

        // Handle different response structures gracefully
        const incidentList = incidentsData.submissions || incidentsData || [];
        const hospitalList = hospitalsData.hospitals || hospitalsData || [];

        setIncidents(incidentList);
        setHospitals(hospitalList);
      } catch (err) {
        console.error("Failed to load initial data:", err);
        setError("System offline. Using local cache mode.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    requestLocationPermission();
  }, [navigate]);

  // ... (Keep existing calculateDistanceMeters) ...
  const calculateDistanceMeters = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Nearest Incident Logic (Client-side fast reaction)
  useEffect(() => {
    if (!location || incidents.length === 0 || ambulanceStatus !== "active") {
      if (ambulanceStatus === "busy" && !currentIncident) {
        // Edge case: busy but lost incident state?
      } else {
        setNearestIncident(null);
      }
      return;
    }

    let nearest = null;
    let minDistance = Infinity;

    incidents.forEach((incident) => {
      // Ensure V2 API fields (latitude/longitude are standard now)
      const incLat = incident.latitude || incident.location?.lat;
      const incLon = incident.longitude || incident.location?.lon;

      if (incLat && incLon) {
        const distance = calculateDistanceMeters(
          location.latitude, location.longitude,
          incLat, incLon
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = incident;
        }
      }
    });

    setNearestIncident(nearest);
    if (minDistance !== Infinity) {
      setDistanceInMeters(minDistance);
    }
  }, [location, incidents, ambulanceStatus, calculateDistanceMeters]);

  // Distance Tracking logic for Busy State
  useEffect(() => {
    if (ambulanceStatus === "busy" && currentIncident && location && !isNavigatingToHospital) {
      const lat = currentIncident.latitude || currentIncident.location?.lat;
      const lon = currentIncident.longitude || currentIncident.location?.lon;

      if (lat && lon) {
        setDistanceInMeters(calculateDistanceMeters(location.latitude, location.longitude, lat, lon));
      }
    }
  }, [location, currentIncident, ambulanceStatus, isNavigatingToHospital, calculateDistanceMeters]);


  const requestLocationPermission = async () => {
    setLocationStatus("requesting");
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation not supported");
      return;
    }
    navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        setLocation(coords);
        setLocationStatus("active");
        // Optional: Post live location to backend for Admin Map
      },
      (err) => {
        console.error(err);
        setLocationError("Location access denied or failed");
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleAcceptIncident = () => {
    if (nearestIncident) {
      setAmbulanceStatus("busy");
      setCurrentIncident(nearestIncident);
      // Notify Backend
      api.post('/ambulance/status', {
        status: 'busy',
        incidentId: nearestIncident.id
      }).catch(console.error);
    }
  };

  const handleReachedIncident = () => {
    setShowCasualtyPopup(true);
    setCasualtyCount(0);
    setCasualties([]);
  };

  const handleCasualtyCountChange = (count) => {
    const num = parseInt(count) || 0;
    setCasualtyCount(num);
    setCasualties(Array(num).fill(0).map((_, i) => ({
      id: i + 1,
      bloodType: "",
      requiredAmount: "",
      severity: "",
      specialtyRequired: ""
    })));
  };

  const updateCasualtyData = (index, field, value) => {
    setCasualties(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  // SMART MATCHING LOGIC (Phase 2 Integration)
  const handleSubmitCasualties = async () => {
    setLoading(true);
    try {
      // 1. Submit Data
      // await api.post('/casualties', { ... casualties ... }) // If endpoint exists

      // 2. Find Best Hospital using Intelligence Layer
      let bestMatch = null;

      if (location) {
        const { matches } = await api.post('/match', {
          latitude: location.latitude,
          longitude: location.longitude,
          injuryType: casualties[0]?.specialtyRequired, // Prioritize first casualty
          bloodType: casualties[0]?.bloodType
        });

        if (matches && matches.length > 0) {
          bestMatch = matches[0]; // The Engine returns sorted list
        }
      }

      if (bestMatch) {
        setNearestHospital(bestMatch);
        setRouteGeometry(bestMatch.route_geometry); // For Map to draw line
        setIsNavigatingToHospital(true);
        setShowCasualtyPopup(false);
      } else {
        alert("No hospitals found nearby!");
      }

    } catch (err) {
      console.error("Matching failed:", err);
      alert("Error finding hospital. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReachedHospital = async () => {
    setAmbulanceStatus("active");
    setCurrentIncident(null);
    setIsNavigatingToHospital(false);
    setNearestHospital(null);
    setCasualties([]);

    // Reset Backend State
    await api.post('/ambulance/status', { status: 'active' }).catch(console.error);
  };

  // Check if within 5 meters of current incident
  const isWithinProximity =
    ambulanceStatus === "busy" &&
    currentIncident &&
    distanceInMeters !== null &&
    distanceInMeters <= PROXIMITY_THRESHOLD;

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  return (
    <div className="Main bg-background-light text-slate-900 antialiased overflow-hidden">
      <div className="flex flex-col h-screen w-full">
        <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-lg md:text-xl">
                emergency
              </span>
            </div>
            <span className="font-bold text-primary tracking-tight text-xs md:text-base">
              EMS Response System
            </span>
            {/* Ambulance Status Badge */}
            <div
              className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${ambulanceStatus === "active"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
                }`}
            >
              {ambulanceStatus === "active" ? "ACTIVE" : "BUSY"}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {/* Location Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <span
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${locationStatus === "active"
                  ? "bg-green-500"
                  : locationStatus === "requesting"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  }`}
              ></span>
              <span className="text-xs font-semibold text-slate-700">
                {locationStatus === "active"
                  ? "Location Active"
                  : locationStatus === "requesting"
                    ? "Requesting..."
                    : "No Location"}
              </span>
            </div>

            {/* Location Error Alert */}
            {locationError && (
              <div className="hidden lg:flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{locationError}</span>
              </div>
            )}

            {/* Got a Call Button - Manual casualty entry without map navigation */}
            {ambulanceStatus === "active" && (
              <button
                onClick={() => {
                  setAmbulanceStatus("busy");
                  setShowCasualtyPopup(true);
                  setCasualtyCount(0);
                  setCasualties([]);
                }}
                className="bg-primary text-white hover:bg-slate-800 px-3 md:px-6 py-2 rounded-lg font-bold flex items-center gap-1 md:gap-2 transition-all active:scale-95 text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span className="hidden sm:inline">Got a Call?</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-700 text-white hover:bg-red-800 px-3 md:px-6 py-2 rounded-lg font-bold flex items-center gap-1 md:gap-2 transition-all active:scale-95 text-xs md:text-sm"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs truncate font-bold">
                  {user}
                </p>
              </div>
              <div
                className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0AcwK3HF6hhNVJRA24til9Ura45zJoZqdV9wW-hiedLm81sbHwL122rreOmOphrhhdOC9K4Vh6Il_59qNo7auxbt2r9DmZsYi1SpC42nTrZ9sj8eVzQmw3xk5cdjCkph1_jx0xD9RkOQJOV_tDldn4A22QYeMSvNSXJxFbgBsvjh8RZ6ocxbw33Z_mgBKA0r9eE-8HTdVMXsItkeyV0HTGiHHG2EZ017MWWh2WFN2f7WZJGW9queuU0OVof8n5sausqLo3ApblZ8')`,
                }}
              ></div>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold max-w-20 truncate">
                  {user}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Casualty Data Entry Popup */}
        {showCasualtyPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-primary">
                      Casualty Data Entry
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Enter details for each casualty
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCasualtyPopup(false);
                      setAmbulanceStatus("active");
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Casualty Count Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Casualties
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={casualtyCount}
                    onChange={(e) => handleCasualtyCountChange(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter number of casualties"

                  />
                </div>

                {/* Casualty Cards */}
                {casualties.length > 0 && (
                  <div className="space-y-4">
                    {casualties.map((casualty, index) => (
                      <div
                        key={casualty.id}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                      >
                        <h3 className="font-bold text-primary mb-3">
                          Casualty #{casualty.id}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Blood Type
                            </label>
                            <select
                              required
                              value={casualty.bloodType}
                              onChange={(e) =>
                                updateCasualtyData(
                                  index,
                                  "bloodType",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="">Select</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Required Amount (L)
                            </label>
                            <input
                              required
                              type="number"
                              step="0.1"
                              min="0"
                              value={casualty.requiredAmount}
                              onChange={(e) =>
                                updateCasualtyData(
                                  index,
                                  "requiredAmount",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                              placeholder="Liters"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Severity
                            </label>
                            <select
                              required
                              value={casualty.severity}
                              onChange={(e) =>
                                updateCasualtyData(
                                  index,
                                  "severity",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Critical">Critical</option>
                              <option value="Severe">Severe</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Minor">Minor</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Specialty Required
                            </label>
                            <select
                              required
                              value={casualty.specialtyRequired}
                              onChange={(e) =>
                                updateCasualtyData(
                                  index,
                                  "specialtyRequired",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Cardiologist">Cardiologist</option>
                              <option value="Neurologist">Neurologist</option>
                              <option value="Orthopedic Surgeon">
                                Orthopedic Surgeon
                              </option>
                              <option value="General Surgeon">
                                General Surgeon
                              </option>
                              <option value="Trauma Surgeon">
                                Trauma Surgeon
                              </option>
                              <option value="Anesthesiologist">
                                Anesthesiologist
                              </option>
                              <option value="Emergency Medicine">
                                Emergency Medicine
                              </option>
                              <option value="Pulmonologist">
                                Pulmonologist
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                {casualties.length > 0 && (
                  <button
                    onClick={handleSubmitCasualties}
                    className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      local_hospital
                    </span>
                    Submit & Navigate to Hospital
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hospital Navigation Banner */}
        {isNavigatingToHospital && nearestHospital && (
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined animate-pulse">
                local_hospital
              </span>
              <div>
                <p className="font-bold">
                  Navigating to {nearestHospital.name}
                </p>
                <p className="text-xs text-blue-200">
                  {nearestHospital.address}
                </p>
              </div>
            </div>
            <button
              onClick={handleReachedHospital}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Reached Hospital
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Show sidebar based on ambulance status */}
          {ambulanceStatus === "active" && nearestIncident ? (
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600 animate-pulse">
                    emergency_home
                  </span>
                  <h2 className="text-primary font-bold text-lg">
                    Nearest Incident
                  </h2>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                  Priority Response
                </p>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="w-full mb-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                    <img
                      alt={nearestIncident.title}
                      className="w-full h-full object-cover grayscale-[0.3]"
                      src={nearestIncident.image}
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-primary">
                      {nearestIncident.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <span className="material-symbols-outlined text-lg text-primary">
                      location_on
                    </span>
                    <span className="text-xs font-semibold">
                      {nearestIncident.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mb-3">
                    <span className="text-slate-500">
                      {nearestIncident.time}
                    </span>
                    <span className="font-bold text-slate-600">
                      {nearestIncident.status}
                    </span>
                  </div>
                  <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-2 flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-blue-900">
                      Distance:
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {distanceInMeters
                        ? `${distanceInMeters.toFixed(0)}m`
                        : "Calculating..."}
                    </span>
                  </div>
                  <button
                    onClick={handleAcceptIncident}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      directions
                    </span>
                    Accept & Navigate
                  </button>
                </div>
              </div>
            </aside>
          ) : ambulanceStatus === "busy" &&
            currentIncident &&
            !isNavigatingToHospital ? (
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-orange-600 animate-pulse">
                    directions_car
                  </span>
                  <h2 className="text-primary font-bold text-lg">En Route</h2>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                  Responding to Incident
                </p>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="w-full mb-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200 p-4">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                    <img
                      alt={currentIncident.title}
                      className="w-full h-full object-cover"
                      src={currentIncident.image}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-primary mb-2">
                    {currentIncident.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <span className="material-symbols-outlined text-lg text-primary">
                      location_on
                    </span>
                    <span className="text-xs font-semibold">
                      {currentIncident.location}
                    </span>
                  </div>
                  <div className="bg-linear-to-r from-orange-50 to-orange-100 rounded-lg p-3 flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-orange-900">
                      Distance:
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {distanceInMeters
                        ? `${distanceInMeters.toFixed(0)}m`
                        : "Calculating..."}
                    </span>
                  </div>

                  {/* Reached Button - shows when within 5 meters */}
                  {isWithinProximity ? (
                    <button
                      onClick={handleReachedIncident}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 animate-pulse"
                    >
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                      Reached?
                    </button>
                  ) : (
                    <div className="w-full bg-slate-100 text-slate-500 py-3 rounded-lg font-semibold text-center text-sm">
                      Get within 5m to confirm arrival
                    </div>
                  )}
                </div>
              </div>
            </aside>
          ) : (
            // Default sidebar - System Status
            <div className="hidden md:block absolute top-6 left-6 z-10 w-80">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-2 w-auto h-auto m-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h2 className="text-primary font-bold text-lg">
                    System Status
                  </h2>
                </div>
                <div className="py-12 flex flex-col items-center justify-center border-t border-slate-100">
                  <span className="material-symbols-outlined text-primary/20 text-5xl mb-4">
                    check_circle
                  </span>
                  <p className="text-primary font-semibold text-center text-base">
                    {isNavigatingToHospital
                      ? "Navigating to Hospital"
                      : "No accidents nearby"}
                  </p>
                  <p className="text-slate-400 text-[11px] text-center mt-2 uppercase tracking-widest font-medium">
                    {ambulanceStatus === "active"
                      ? "Scanning Area"
                      : "In Transit"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <main className="flex-1 relative overflow-hidden m-2 md:m-6 rounded-2xl border border-slate-300/30 shadow-inner">
            <Map
              ambulanceLocation={location}
              ambulanceName={user}
              incidents={ambulanceStatus === "active" ? incidents : []}
              nearestIncident={
                ambulanceStatus === "busy" ? currentIncident : nearestIncident
              }
              targetHospital={isNavigatingToHospital ? nearestHospital : null}
              routeGeometry={routeGeometry}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AmbulanceUser;
