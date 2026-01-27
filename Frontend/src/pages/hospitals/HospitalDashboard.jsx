import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function HospitalDashboard() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [incomingIncidents, setIncomingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userAvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAznK4Z6bAxZgs6fcy-L7t74V4PiEJ370LX_cCud0cr1VAc-o85wtbdeYFkWUGW10giLXaykhB_FlGKTV3iyz0PKJXRVrQ_rZcGWI-cwre6-yDLpWYagksKCsfl3nd67fFcdVWT7U-Jpa6Tl_l1Q9fHmut1hLpytx4-6eRhzAsihyrNG5IHPoQ9oukaQkyNRfgFes0jM4gnceJ2V7xjfh5xR4M3WkPMGd_JSgexHtXMRrZLnGSP0FUI3Ibt1GwPjrTioOKZ30ZQ9ms";

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Resolve Hospital ID from Name (Demo Logic)
        const userName = localStorage.getItem("userName"); // e.g., "Bir Hospital"
        const { data: response } = await api.get('/hospitals/map');
        const allHospitals = response.hospitals || [];

        const myHospital = allHospitals.find(h => h.name === userName);

        if (!myHospital) {
          throw new Error("Hospital record not found for user: " + userName);
        }

        // 2. Fetch Full Hospital Details
        // We might already have enough from map, but let's be safe
        // const { data: fullDetails } = await api.get(/hospitals/${myHospital.id});
        setHospital(myHospital);

        // 3. Fetch Incoming Incidents
        const { data: incoming } = await api.get(`/hospital/${myHospital.id}/incoming`);
        setIncomingIncidents(incoming || []);

      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Poll for updates every 10 seconds (Simple Realtime)
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !hospital) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-slate-600 font-medium animate-pulse">Connecting to Hospital Network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="font-bold">System Error</p>
          <p className="text-sm">{error}</p>
          <button onClick={handleLogout} className="mt-4 text-xs underline">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="Main bg-slate-50 text-slate-900 font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 z-10 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
              <span className="material-symbols-outlined block">local_hospital</span>
            </div>
            <div>
              <h1 className="text-slate-800 text-sm font-bold leading-tight">
                {hospital?.name}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Command Center
              </p>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link to="/hospital" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold transition-colors">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm">Overview</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
          <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0 shadow-sm/50">
            <div className="flex items-center gap-6 flex-1">
              <h2 className="text-slate-800 text-lg font-bold tracking-tight">
                Real-Time Dashboard
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold">Live System</span>
              </div>
              <div
                className="h-9 w-9 rounded-full bg-cover bg-center border-2 border-slate-100 shadow-sm"
                style={{ backgroundImage: `url('${userAvatarUrl}')` }}
              ></div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Stats Request */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <span className="material-symbols-outlined block">bed</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-800">{hospital?.available_beds}</span>
                  <span className="text-sm text-slate-500 font-medium">beds free</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <span className="material-symbols-outlined block">bloodtype</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Bank</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-800">
                    {hospital?.blood_inventory ? Object.values(hospital.blood_inventory).reduce((a, b) => a + b, 0) : 0}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">units total</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <span className="material-symbols-outlined block">ambulance</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inbound</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-800">{incomingIncidents.length}</span>
                  <span className="text-sm text-slate-500 font-medium">approaching</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Incoming Feed */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-800 font-bold text-lg">Incoming Traffic</h3>
                </div>

                {incomingIncidents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-3xl text-slate-300">check_circle</span>
                    </div>
                    <h4 className="text-slate-900 font-bold mb-1">All Clear</h4>
                    <p className="text-slate-500 text-sm">No ambulances are currently en route to your facility.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingIncidents.map((inc) => (
                      <div key={inc.id} className="bg-white rounded-xl border border-l-4 border-l-red-500 border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="bg-red-50 p-3 rounded-xl flex items-center justify-center h-fit">
                              <span className="material-symbols-outlined text-red-600">emergency_share</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900 text-base">{inc.title}</h4>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                  {inc.ambulances?.plate_number || 'Unknown Amb'}
                                </span>
                              </div>
                              <p className="text-slate-500 text-sm mb-3 max-w-md">{inc.description || 'No description provided.'}</p>

                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                                  <span className="material-symbols-outlined text-sm">location_on</span>
                                  <span className="font-semibold">{inc.address || 'Location Shared'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                              ETA: --
                            </div>
                            <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 uppercase">
                              {inc.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <section className="bg-white p-6 rounded-2xl border border-slate-200 h-fit">
                  <h3 className="font-bold text-slate-800 mb-4">Live Updates</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-600 text-sm">update</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">System Synchronized</p>
                        <p className="text-xs text-slate-400">Just now</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HospitalDashboard;
