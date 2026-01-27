function HospitalStaff() {
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
                City General
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md shadow-primary/20"
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
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-bold shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6 flex-1">
              <h2 className="text-primary text-lg font-bold">
                Staffing Management
              </h2>
              <div className="max-w-md w-full relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Search medical personnel..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined">translate</span>
              </button>
              <button className="p-2 rounded-lg bg-slate-100 text-slate-600 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div
                className="h-8 w-8 rounded-full bg-cover bg-center border border-slate-200"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPa58irfqG_HKVD7ZdyXY496Y0YBm0fELjwfyWg-g1MoucvaDahGSYJJQMfuCCutS8IHt17KjpUUr8QcCec2sPCsTsdxYfabtHkgb4QwllUkCjyX41aZB2iCWtmTodtBvOkNW0zU_IUU-kmHI8m2LHITpx2ktHgB65UKQvnmOqtVuyEahb6qjwF7dxAU3pRpZZs9WWy82Bd0DJOQmXhSPB_mJR65DR2ojxqAARv9s3ySjS7EDm_pGo6v4qBgHtJanRQbeQbq_6YOE')",
                }}
              ></div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-primary text-white">
                  <div>
                    <h3 className="font-bold text-xl">
                      Staff Availability Control
                    </h3>
                    <p className="text-white/70 text-xs mt-1">
                      Adjust real-time personnel counts across medical
                      departments.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Live System
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto bg-slate-50">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-primary uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-8 py-4 w-1/2">Medical Specialty</th>
                        <th className="px-8 py-4">Staff on Duty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                medical_services
                              </span>
                            </span>
                            <span className="text-base">
                              Emergency Physicians
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="14"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                content_cut
                              </span>
                            </span>
                            <span className="text-base">Surgeons</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="8"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                vital_signs
                              </span>
                            </span>
                            <span className="text-base">ICU Nurses</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="32"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                ambulance
                              </span>
                            </span>
                            <span className="text-base">Paramedics</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="18"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                masks
                              </span>
                            </span>
                            <span className="text-base">Anesthesiologists</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="6"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                radiology
                              </span>
                            </span>
                            <span className="text-base">Radiologists</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="4"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                biotech
                              </span>
                            </span>
                            <span className="text-base">Lab Technicians</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="12"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 border-b-0">
                        <td className="px-8 py-5 font-bold text-primary align-middle">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">
                                volunteer_activism
                              </span>
                            </span>
                            <span className="text-base">Support Staff</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center max-w-55">
                            <button className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <input
                              className="w-full h-10 text-center border-y border-slate-300 bg-white text-base font-bold text-primary focus:ring-0 focus:border-slate-300"
                              type="number"
                              defaultValue="25"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-white hover:bg-slate-100 border border-slate-300 text-primary font-bold transition-colors">
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-8 py-8 border-t border-slate-200 bg-white flex flex-col items-center">
                  <button className="w-full max-w-lg bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 text-lg">
                    <span className="material-symbols-outlined">
                      how_to_reg
                    </span>
                    <span>Update Staffing Records</span>
                  </button>
                  <p className="text-slate-400 text-[10px] mt-4 uppercase tracking-widest font-bold">
                    Shift verification: Active • Last confirmed by Shift Lead
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

export default HospitalStaff;
