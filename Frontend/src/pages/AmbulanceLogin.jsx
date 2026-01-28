import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function AmbulanceLogin() {
    const navigate = useNavigate();
    const [orgType, setOrgType] = useState("government");
    const [hospitalIndex, setHospitalIndex] = useState(0);
    const [plateNumber, setPlateNumber] = useState(""); // Used as username for ambulance
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        const loadHospitals = async () => {
            try {
                const response = await fetch("/hospitals.json");
                const data = await response.json();
                setHospitals(data.hospitals || []);
            } catch (err) {
                console.error("Failed to load hospitals", err);
            }
        };
        loadHospitals();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!plateNumber || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/login/ambulance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plateNumber: plateNumber,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem("userType", "ambulance");
            // Save username (plate number) for Dashboard validation
            localStorage.setItem("userName", data.user.username || plateNumber);

            // Hospital ref is less relevant now or comes from user object
            if (data.user.hospital_id) {
                localStorage.setItem("hospitalRef", data.user.hospital_id);
            }

            navigate("/ambulance");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredHospitals = hospitals.filter(h => h.type === orgType);
    const selectedHospital = filteredHospitals[hospitalIndex];

    return (
        <div className="min-h-screen bg-soft-bg flex flex-col font-display p-6">
            <div className="max-w-md w-full mx-auto my-auto">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white">
                    <div className="bg-accent/20 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-9xl absolute -bottom-4 -left-4 rotate-12">ambulance</span>
                        </div>
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                            <span className="material-symbols-outlined text-primary text-3xl">ambulance</span>
                        </div>
                        <h1 className="text-2xl font-black text-primary relative z-10">Ambulance Portal</h1>
                        <p className="text-primary/70 font-medium relative z-10">Emergency Unit Login</p>
                    </div>

                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 pt-2">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">badge</span>
                                <input
                                    type="text"
                                    placeholder="Plate Number (e.g. GA1PA101)"
                                    value={plateNumber}
                                    onChange={(e) => setPlateNumber(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400 font-bold"
                                />
                            </div>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                                <input
                                    type="password"
                                    placeholder="Access Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400 font-bold"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 mt-4"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    <span>Login to Unit</span>
                                    <span className="material-symbols-outlined">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full p-6 text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2 border-t border-gray-50 bg-gray-50/50"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Portal Selection
                    </button>
                </div>
            </div>
        </div>
    );
}
