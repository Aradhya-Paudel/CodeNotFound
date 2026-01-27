import { useState } from "react";

function HospitalAdmin() {
  const [hospitalData, setHospitalData] = useState({});

  return (
    <div class="Main bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <div class="flex h-screen overflow-hidden">
        <aside class="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0">
          <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div class="bg-primary p-2 rounded-lg text-white">
              <span class="material-symbols-outlined block">emergency</span>
            </div>
            <div>
              <h1 class="text-primary dark:text-accent-blue text-sm font-bold leading-tight">
                City General
              </h1>
              <p class="text-slate-500 text-xs font-medium">Emergency Hub</p>
            </div>
          </div>
          <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
            <a
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white"
              href="#"
            >
              <span class="material-symbols-outlined">dashboard</span>
              <span class="text-sm font-medium">Dashboard</span>
            </a>
            <a
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              href="#"
            >
              <span class="material-symbols-outlined">inventory_2</span>
              <span class="text-sm font-medium">Inventory</span>
            </a>
            <a
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              href="#"
            >
              <span class="material-symbols-outlined">ambulance</span>
              <span class="text-sm font-medium">Fleet Management</span>
            </a>
            <a
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              href="#"
            >
              <span class="material-symbols-outlined">group</span>
              <span class="text-sm font-medium">Staffing</span>
            </a>
            <a
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              href="#"
            >
              <span class="material-symbols-outlined">notifications</span>
              <span class="text-sm font-medium">Alerts</span>
            </a>
          </nav>
          <div class="p-4 border-t border-slate-200 dark:border-slate-800">
            <button class="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined text-sm">campaign</span>
              <span>Emergency Mode</span>
            </button>
          </div>
        </aside>
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-8 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-6 flex-1">
              <h2 class="text-primary dark:text-white text-lg font-bold">
                Hospital Resource Management
              </h2>
              <div class="max-w-md w-full relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Search resources, units, or patients..."
                  type="text"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <span class="material-symbols-outlined">translate</span>
              </button>
              <button class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div
                class="h-8 w-8 rounded-full bg-cover bg-center border border-slate-200"
                data-alt="User profile avatar circle"
                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAznK4Z6bAxZgs6fcy-L7t74V4PiEJ370LX_cCud0cr1VAc-o85wtbdeYFkWUGW10giLXaykhB_FlGKTV3iyz0PKJXRVrQ_rZcGWI-cwre6-yDLpWYagksKCsfl3nd67fFcdVWT7U-Jpa6Tl_l1Q9fHmut1hLpytx4-6eRhzAsihyrNG5IHPoQ9oukaQkyNRfgFes0jM4gnceJ2V7xjfh5xR4M3WkPMGd_JSgexHtXMRrZLnGSP0FUI3Ibt1GwPjrTioOKZ30ZQ9ms')"
              ></div>
            </div>
          </header>
          <div class="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark space-y-8">
            <div class="grid grid-cols-1 gap-4">
              <div class="bg-alert-red border border-[#ffcfcf] p-4 rounded-lg flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary font-bold">
                    warning
                  </span>
                  <p class="text-primary font-bold text-sm tracking-tight">
                    CRITICAL ALERT: ICU Capacity at 95%. Diversion protocol
                    recommended for non-trauma cases.
                  </p>
                </div>
                <button class="text-xs font-bold text-primary underline">
                  Acknowledge
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-accent-blue/30 dark:bg-primary/20 p-6 rounded-xl border border-accent-blue/50">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-primary dark:text-accent-blue font-bold text-sm uppercase tracking-wider">
                    Beds Available
                  </h3>
                  <span class="material-symbols-outlined text-primary dark:text-accent-blue">
                    bed
                  </span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold text-primary dark:text-white">
                    42
                  </span>
                </div>
                <p class="text-primary/60 dark:text-slate-400 text-xs mt-2">
                  12 ICU, 30 General Ward
                </p>
              </div>
              <div class="bg-accent-blue/30 dark:bg-primary/20 p-6 rounded-xl border border-accent-blue/50">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-primary dark:text-accent-blue font-bold text-sm uppercase tracking-wider">
                    Blood Inventory
                  </h3>
                  <span class="material-symbols-outlined text-primary dark:text-accent-blue">
                    bloodtype
                  </span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold text-primary dark:text-white">
                    1,280
                  </span>
                </div>
                <p class="text-primary/60 dark:text-slate-400 text-xs mt-2">
                  Units across all types
                </p>
              </div>
              <div class="bg-accent-blue/30 dark:bg-primary/20 p-6 rounded-xl border border-accent-blue/50">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-primary dark:text-accent-blue font-bold text-sm uppercase tracking-wider">
                    Active Specialties
                  </h3>
                  <span class="material-symbols-outlined text-primary dark:text-accent-blue">
                    medical_services
                  </span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold text-primary dark:text-white">
                    12
                  </span>
                </div>
                <p class="text-primary/60 dark:text-slate-400 text-xs mt-2">
                  Trauma &amp; Cardiology On-Call
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 space-y-8">
                <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <h3 class="text-primary dark:text-white font-bold">
                      Quick Resource Update
                    </h3>
                  </div>
                  <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase">
                        Update Bed Availability
                      </label>
                      <div class="flex gap-2">
                        <select class="flex-1 rounded-lg border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-sm">
                          <option>General Ward</option>
                          <option>ICU</option>
                          <option>Emergency Room</option>
                        </select>
                        <input
                          class="w-20 rounded-lg border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-sm"
                          type="number"
                          value="30"
                        />
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase">
                        Specialty Status
                      </label>
                      <div class="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span class="text-sm font-medium">
                          Cardiology Department
                        </span>
                        <div class="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                          <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div class="sm:col-span-2">
                      <button class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors">
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </section>
                <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 class="text-primary dark:text-white font-bold">
                      Blood Type Inventory
                    </h3>
                    <button class="text-primary text-xs font-bold uppercase hover:underline">
                      Export Data
                    </button>
                  </div>
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th class="px-6 py-3">Blood Type</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3">In-Stock (Liters)</th>
                        <th class="px-6 py-3">Demand Level</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          A Positive (A+)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold uppercase">
                            Stable
                          </span>
                        </td>
                        <td class="px-6 py-4">450 Liters</td>
                        <td class="px-6 py-4">Moderate</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          A Negative (A-)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-bold uppercase">
                            Low
                          </span>
                        </td>
                        <td class="px-6 py-4">45 Liters</td>
                        <td class="px-6 py-4">High</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          B Positive (B+)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold uppercase">
                            Stable
                          </span>
                        </td>
                        <td class="px-6 py-4">320 Liters</td>
                        <td class="px-6 py-4">Moderate</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          B Negative (B-)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-bold uppercase">
                            Low
                          </span>
                        </td>
                        <td class="px-6 py-4">84 Liters</td>
                        <td class="px-6 py-4">High</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          O Positive (O+)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold uppercase">
                            Stable
                          </span>
                        </td>
                        <td class="px-6 py-4">560 Liters</td>
                        <td class="px-6 py-4">High</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          O Negative (O-)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-bold uppercase">
                            Critical
                          </span>
                        </td>
                        <td class="px-6 py-4">12 Liters</td>
                        <td class="px-6 py-4">Extreme</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          AB Positive (AB+)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold uppercase">
                            Stable
                          </span>
                        </td>
                        <td class="px-6 py-4">192 Liters</td>
                        <td class="px-6 py-4">Low</td>
                      </tr>
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td class="px-6 py-4 font-bold text-primary dark:text-accent-blue">
                          AB Negative (AB-)
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold uppercase">
                            Stable
                          </span>
                        </td>
                        <td class="px-6 py-4">65 Liters</td>
                        <td class="px-6 py-4">Low</td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
              <aside class="space-y-6">
                <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-fit overflow-hidden">
                  <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 class="text-primary dark:text-white font-bold">
                      Incoming Ambulances
                    </h3>
                    <span class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                  <div class="p-4">
                    <div class="grid grid-cols-[32px_1fr] gap-x-4">
                      <div class="flex flex-col items-center gap-1">
                        <div class="text-primary">
                          <span class="material-symbols-outlined">
                            ambulance
                          </span>
                        </div>
                        <div class="w-0.5 bg-slate-200 dark:bg-slate-800 h-8"></div>
                      </div>
                      <div class="flex flex-col pb-6">
                        <div class="flex justify-between items-start">
                          <p class="text-primary dark:text-white text-sm font-bold">
                            #AMB-102
                          </p>
                          <span class="text-red-600 text-xs font-bold">
                            4m ETA
                          </span>
                        </div>
                        <p class="text-slate-500 text-xs mt-0.5">
                          Critical Trauma - Priority 1
                        </p>
                        <div class="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div class="bg-red-500 h-full w-[80%]"></div>
                        </div>
                      </div>
                      <div class="flex flex-col items-center gap-1">
                        <div class="text-slate-400">
                          <span class="material-symbols-outlined">
                            ambulance
                          </span>
                        </div>
                        <div class="w-0.5 bg-slate-200 dark:bg-slate-800 h-8"></div>
                      </div>
                      <div class="flex flex-col pb-6">
                        <div class="flex justify-between items-start">
                          <p class="text-primary dark:text-white text-sm font-bold">
                            #AMB-089
                          </p>
                          <span class="text-primary text-xs font-bold">
                            12m ETA
                          </span>
                        </div>
                        <p class="text-slate-500 text-xs mt-0.5">
                          Cardiac - Stable Status
                        </p>
                        <div class="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div class="bg-primary h-full w-[45%]"></div>
                        </div>
                      </div>
                      <div class="flex flex-col items-center gap-1">
                        <div class="text-slate-400">
                          <span class="material-symbols-outlined">
                            ambulance
                          </span>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <div class="flex justify-between items-start">
                          <p class="text-primary dark:text-white text-sm font-bold">
                            #AMB-214
                          </p>
                          <span class="text-primary text-xs font-bold">
                            18m ETA
                          </span>
                        </div>
                        <p class="text-slate-500 text-xs mt-0.5">
                          Respiratory - Urgent
                        </p>
                        <div class="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div class="bg-primary h-full w-[25%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-4">
                    <button class="w-full text-xs font-bold text-primary hover:text-primary/70 flex items-center justify-center gap-1">
                      <span>VIEW LIVE TRACKER MAP</span>
                      <span class="material-symbols-outlined text-sm">
                        open_in_new
                      </span>
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HospitalAdmin;
