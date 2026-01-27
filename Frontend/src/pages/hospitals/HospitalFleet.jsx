function HospitalFleet() {
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
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md shadow-primary/20"
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
                Fleet Management
              </h2>
              <div class="max-w-md w-full relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Search vehicles or requests..."
                  type="text"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-3 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                <span class="material-symbols-outlined text-slate-500 text-lg">
                  person
                </span>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300">
                  USER ID: EMP-9421
                </span>
              </div>
              <div
                class="h-8 w-8 rounded-full bg-cover bg-center border border-slate-200"
                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPa58irfqG_HKVD7ZdyXY496Y0YBm0fELjwfyWg-g1MoucvaDahGSYJJQMfuCCutS8IHt17KjpUUr8QcCec2sPCsTsdxYfabtHkgb4QwllUkCjyX41aZB2iCWtmTodtBvOkNW0zU_IUU-kmHI8m2LHITpx2ktHgB65UKQvnmOqtVuyEahb6qjwF7dxAU3pRpZZs9WWy82Bd0DJOQmXhSPB_mJR65DR2ojxqAARv9s3ySjS7EDm_pGo6v4qBgHtJanRQbeQbq_6YOE')"
              ></div>
            </div>
          </header>
          <div class="flex-1 overflow-y-auto p-8 bg-alert-red dark:bg-background-dark">
            <div class="max-w-5xl mx-auto space-y-8 pb-12">
              <section class="bg-accent-blue dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div class="px-6 py-5 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between bg-primary text-white">
                  <div>
                    <h3 class="font-bold text-xl">
                      Vehicle Availability Control
                    </h3>
                    <p class="text-white/70 text-xs mt-1">
                      Manage current deployment levels of the emergency fleet.
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="flex h-2 w-2 rounded-full bg-green-400"></span>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-white">
                      Active Status
                    </span>
                  </div>
                </div>
                <div class="overflow-x-auto bg-accent-blue/30 p-8">
                  <div class="flex items-center justify-between max-w-2xl mx-auto bg-white/40 dark:bg-slate-800/30 p-6 rounded-xl border border-white/50">
                    <div class="flex items-center gap-6">
                      <span class="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                        <span class="material-symbols-outlined text-3xl">
                          ambulance
                        </span>
                      </span>
                      <div>
                        <span class="text-xl font-bold text-primary dark:text-accent-blue block">
                          Emergency Ambulances
                        </span>
                        <span class="text-xs text-slate-500 font-medium">
                          Ready for immediate dispatch
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center w-full max-w-[240px]">
                      <button class="w-12 h-12 flex items-center justify-center rounded-l-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 text-primary font-bold transition-colors">
                        <span class="material-symbols-outlined">remove</span>
                      </button>
                      <input
                        class="w-full h-12 text-center border-y border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xl font-bold text-primary focus:ring-0 focus:border-slate-300"
                        type="number"
                        value="12"
                      />
                      <button class="w-12 h-12 flex items-center justify-center rounded-r-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 text-primary font-bold transition-colors">
                        <span class="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div class="flex items-center gap-3 mb-6">
                  <span class="material-symbols-outlined text-primary">
                    move_to_inbox
                  </span>
                  <h3 class="text-xl font-bold text-primary dark:text-white">
                    Incoming Transfer Requests
                  </h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h4 class="font-bold text-primary dark:text-accent-blue text-lg">
                          St. Mary's Hospital
                        </h4>
                        <p class="text-slate-500 text-xs font-medium">
                          Transfer Request • 12 mins ago
                        </p>
                      </div>
                      <span class="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">
                        URGENT
                      </span>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span class="material-symbols-outlined text-lg">
                          medical_information
                        </span>
                        <span>Support for 2 Critical Care Transports</span>
                      </div>
                      <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span class="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        <span>4.2 miles from current location</span>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <button class="py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Decline
                      </button>
                      <button class="py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 shadow-md shadow-primary/20 transition-all">
                        Approve
                      </button>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h4 class="font-bold text-primary dark:text-accent-blue text-lg">
                          Northside Medical Center
                        </h4>
                        <p class="text-slate-500 text-xs font-medium">
                          Support Request • 28 mins ago
                        </p>
                      </div>
                      <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                        ROUTINE
                      </span>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span class="material-symbols-outlined text-lg">
                          medical_information
                        </span>
                        <span>Ambulance Standby (1 unit)</span>
                      </div>
                      <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span class="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        <span>6.8 miles from current location</span>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <button class="py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Decline
                      </button>
                      <button class="py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 shadow-md shadow-primary/20 transition-all">
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <button class="w-full max-w-lg bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 text-lg">
                  <span class="material-symbols-outlined text-2xl">save</span>
                  <span>Update Fleet Records</span>
                </button>
                <p class="text-slate-400 text-[10px] mt-4 uppercase tracking-widest font-bold">
                  Automatic sync enabled • Last updated at 14:32
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HospitalFleet;
