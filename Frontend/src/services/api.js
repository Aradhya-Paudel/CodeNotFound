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
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => {
        // CamelCase conversion logic could go here if backend is snake_case
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle token expiration (401 Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshResponse = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/refresh`, 
                        { refreshToken }
                    );
                    
                    const { access_token } = refreshResponse.data;
                    localStorage.setItem('accessToken', access_token);
                    
                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('userType');
                localStorage.removeItem('userName');
                window.location.href = '/';
            }
        }
        
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
    }
);

// API endpoint functions for better organization

// Auth APIs
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    me: () => api.get('/auth/me')
};

// Hospital APIs
export const hospitalAPI = {
    getAll: () => api.get('/hospitals'),
    getMapData: () => api.get('/hospitals/map'),
    getStatus: (id) => api.get(`/hospital/${id}/status`),
    getDoctors: (id) => api.get(`/hospitals/${id}/doctors`)
};

// Ambulance APIs
export const ambulanceAPI = {
    updateLocation: (locationData) => api.post('/ambulance/location', locationData),
    startTrip: (tripData) => api.post('/ambulance/trip/start', tripData),
    completeTrip: (tripId, status) => api.patch(`/ambulance/trip/${tripId}/complete`, { status })
};

// Alert APIs (for citizen reporting)
export const alertAPI = {
    create: (alertData) => api.post('/alerts', alertData),
    getNearby: (params) => api.get('/alerts/nearby', { params }),
    accept: (alertId, ambulanceId) => api.post(`/alerts/${alertId}/accept`, { ambulance_id: ambulanceId }),
    getAll: () => api.get('/alerts')
};

// Map APIs
export const mapAPI = {
    geocode: (address) => api.post('/geocode', { address }),
    reverseGeocode: (latitude, longitude) => api.post('/reverse-geocode', { latitude, longitude })
};

export default api;
