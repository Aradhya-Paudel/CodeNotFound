import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HospitalInventory() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [inventoryData, setInventoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userAvatarUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAznK4Z6bAxZgs6fcy-L7t74V4PiEJ370LX_cCud0cr1VAc-o85wtbdeYFkWUGW10giLXaykhB_FlGKTV3iyz0PKJXRVrQ_rZcGWI-cwre6-yDLpWYagksKCsfl3nd67fFcdVWT7U-Jpa6Tl_l1Q9fHmut1hLpytx4-6eRhzAsihyrNG5IHPoQ9oukaQkyNRfgFes0jM4gnceJ2V7xjfh5xR4M3WkPMGd_JSgexHtXMRrZLnGSP0FUI3Ibt1GwPjrTioOKZ30ZQ9ms";

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  // Load hospital data and inventory from hospitals.json
  useEffect(() => {
    const loadHospitalData = async () => {
      try {
        const response = await fetch("/hospitals.json");
        const data = await response.json();
        // Extract first hospital from the data
        const selectedHospital = data.hospitals[0];

        if (!selectedHospital) {
          setError("Hospital not found");
        } else {
          setHospital(selectedHospital);
          // Initialize inventory data from hospital bloodInventory
          const inventoryMap = {};
          selectedHospital.bloodInventory.bloodTypes.forEach((blood) => {
            inventoryMap[blood.type] = blood.liters;
          });
          setInventoryData(inventoryMap);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadHospitalData();
  }, []);

  const handleQuantityChange = (bloodType, value) => {
    setInventoryData({
      ...inventoryData,
      [bloodType]: parseInt(value, 10) || 0,
    });
  };

  const handleUpdateInventory = async () => {
    // Update logic can be implemented here
    alert("Inventory updated successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-slate-600">Loading hospital data...</div>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-red-600">Error loading hospital data: {error}</div>
      </div>
    );
  }

  return (
    <div className="Main bg-slate-50 text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <span className="material-symbols-outlined block">emergency</span>
            </div>
            <div>
              <h1 className="text-primary text-sm font-bold leading-tight">
                {hospital.name}
              </h1>
              <p className="text-slate-500 text-xs font-medium">
                Emergency Hub
              </p>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
              href="#"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white"
              href="#"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-sm font-medium">Inventory</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
              href="#"
            >
              <span className="material-symbols-outlined">ambulance</span>
              <span className="text-sm font-medium">Fleet Management</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
              href="#"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm font-medium">Staffing</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
              href="#"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="text-sm font-medium">Alerts</span>
            </a>
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-700 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-red-800 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6 flex-1">
              <h2 className="text-primary text-lg font-bold">
                Blood Inventory Management
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="h-8 w-8 rounded-full bg-cover bg-center border border-slate-200"
                style={{ backgroundImage: `url('${userAvatarUrl}')` }}
                title="User profile avatar circle"
              ></div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-primary font-bold text-xl">
                      Blood Stock Control
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Manage and update the current reserve levels for all blood
                      types.
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-8 py-4 w-1/2">Blood Type</th>
                        <th className="px-8 py-4">Quantity (Liters)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hospital.bloodInventory.bloodTypes.map(
                        (blood, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-8 py-5 font-bold text-primary align-middle">
                              <div className="flex items-center gap-4">
                                <span
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                    blood.type === "O-"
                                      ? "bg-red-600 text-white ring-4 ring-red-100"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {blood.type}
                                </span>
                                <span className="text-base">
                                  Blood {blood.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center max-w-55">
                                <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold transition-colors">
                                  <span className="material-symbols-outlined">
                                    remove
                                  </span>
                                </button>
                                <input
                                  className="w-full h-10 text-center border-y border-slate-200 bg-white text-base font-medium focus:ring-0 focus:border-slate-200"
                                  type="number"
                                  value={inventoryData[blood.type] || 0}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      blood.type,
                                      e.target.value,
                                    )
                                  }
                                />
                                <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold transition-colors">
                                  <span className="material-symbols-outlined">
                                    add
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-8 py-8 border-t border-slate-200 bg-slate-50 flex flex-col items-center">
                  <button
                    onClick={handleUpdateInventory}
                    className="w-full max-w-lg bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 text-lg"
                  >
                    <span className="material-symbols-outlined">save</span>
                    <span>Update Inventory Database</span>
                  </button>
                  <p className="text-slate-400 text-[10px] mt-4 uppercase tracking-widest font-bold">
                    Last updated: 14:32:01 • By Admin
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HospitalInventory;
