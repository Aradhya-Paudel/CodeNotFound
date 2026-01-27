import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function HospitalLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hospitalsMapping, setHospitalsMapping] = useState([]);

    useEffect(() => {
        // Load mapping to resolve hospital name from ID after login
        fetch("/hospitals.json")
            .then(res => res.json())
            .then(data => setHospitalsMapping(data.hospitals || []))
            .catch(err => console.error("Mapping error:", err));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !username || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Resolve hospital name from entity_id
            const hInfo = hospitalsMapping.find(h => h.id === data.user.entity_id);

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem("userType", data.user.role);
            localStorage.setItem("hospitalId", data.user.entity_id);
            localStorage.setItem("userName", hInfo ? hInfo.name : "Admin"); // Required by Dashboard

            navigate("/hospital");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-display p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full -ml-64 -mb-64 blur-3xl" />

            <div className="max-w-md w-full mx-auto my-auto relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-primary/5">
                            <span className="material-symbols-outlined text-primary text-4xl">local_hospital</span>
                        </div>
                        <h1 className="text-3xl font-black text-primary tracking-tight">Admin Portal</h1>
                        <p className="text-gray-400 font-semibold mt-2">Healthcare Network Management</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">email</span>
                                <input
                                    type="email"
                                    placeholder="Official Gmail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300 font-bold"
                                />
                            </div>

                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">person</span>
                                <input
                                    type="text"
                                    placeholder="Admin Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300 font-bold"
                                />
                            </div>

                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">key</span>
                                <input
                                    type="password"
                                    placeholder="System Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300 font-bold"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-primary hover:bg-primary/95 disabled:bg-primary/40 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <span className="material-symbols-outlined uppercase text-sm font-black">lock_open</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center gap-6">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            Switch Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
