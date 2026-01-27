import axios from 'axios';

// Get backend URL from environment or default to localhost
// Note: Vite uses import.meta.env
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for Auth Token
api.interceptors.request.use(
    (config) => {
        // For now we don't have a token system in localStorage fully standardized
        // But if we did:
        // const token = localStorage.getItem('auth_token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // CamelCase conversion logic could go here if backend is snake_case
        return response;
    },
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error); // Return data directly if available
    }
);

export default api;
