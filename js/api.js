// API Configuration
const API_CONFIG = {
    // Use environment-based API URL
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : 'https://ngo-backend-api.onrender.com/api', // You'll need to update this with your actual deployed backend URL
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

// Add auth token to headers if available
const addAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        API_CONFIG.HEADERS['Authorization'] = `Bearer ${token}`;
    }
};

// API endpoints
const API = {
    // Auth endpoints
    auth: {
        login: async (credentials) => {
            addAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(credentials)
            });
            return await response.json();
        },
        register: async (userData) => {
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(userData)
            });
            return await response.json();
        }
    },
    
    // Donations endpoints
    donations: {
        getAll: async () => {
            addAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}/donations`, {
                headers: API_CONFIG.HEADERS
            });
            return await response.json();
        },
        create: async (donationData) => {
            addAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}/donations`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(donationData)
            });
            return await response.json();
        },
        update: async (id, donationData) => {
            addAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}/donations/${id}`, {
                method: 'PUT',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(donationData)
            });
            return await response.json();
        },
        delete: async (id) => {
            addAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}/donations/${id}`, {
                method: 'DELETE',
                headers: API_CONFIG.HEADERS
            });
            return await response.json();
        }
    }
};

export default API;
