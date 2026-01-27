import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-display">
            <header className="py-6 px-10 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white">emergency</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary">Emergency Network</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="text-center mb-16 space-y-4 max-w-2xl animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-black text-primary leading-tight">
                        Integrated Emergency <br />
                        <span className="text-accent underline decoration-4 underline-offset-8">Response Portal</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl font-medium">
                        Streamlining communication between Pokhara Municipality hospitals and ambulance services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                    {/* Hospital Admin Portal Card */}
                    <button
                        onClick={() => navigate("/login/hospital")}
                        className="group relative bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden text-left"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                                <span className="material-symbols-outlined text-primary text-4xl group-hover:text-white transition-colors duration-500">local_hospital</span>
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-3">Hospital Admin</h2>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Manage hospital resources, staff, and monitor incoming emergencies in real-time.
                            </p>
                            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                                <span>Enter Portal</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </div>
                    </button>

                    {/* Ambulance Service Portal Card */}
                    <button
                        onClick={() => navigate("/login/ambulance")}
                        className="group relative bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden text-left"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-colors duration-500">
                                <span className="material-symbols-outlined text-primary text-4xl group-hover:text-white transition-colors duration-500">ambulance</span>
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-3">Ambulance Unit</h2>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Coordinate with hospitals, update status, and respond to emergency dispatches.
                            </p>
                            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                                <span>Enter Portal</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-12">
                    <button
                        onClick={() => navigate("/guest")}
                        className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-500 font-semibold hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                    >
                        <span>Public Emergency View</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                </div>
            </main>

            <footer className="py-10 px-10 text-center text-gray-400 text-sm">
                <p>&copy; 2026 Pokhara Municipality Emergency Network. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
