// API Configuration
const API_CONFIG = {
    // Use environment-based API URL
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : 'https://ngo-backend-api.onrender.com/api',
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

// Handle API errors
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// API endpoints
const API = {
    // Auth endpoints
    auth: {
        login: async (credentials) => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify(credentials)
                });
                const data = await handleResponse(response);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                return data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        register: async (userData) => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify(userData)
                });
                const data = await handleResponse(response);
                return data;
            } catch (error) {
                console.error('Registration error:', error);
                throw error;
            }
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/pages/login.html';
        },
        getCurrentUser: () => {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
    },
    
    // Donations endpoints
    donations: {
        getAll: async () => {
            try {
                addAuthToken();
                const response = await fetch(`${API_CONFIG.BASE_URL}/donations`, {
                    headers: API_CONFIG.HEADERS
                });
                return handleResponse(response);
            } catch (error) {
                console.error('Get donations error:', error);
                throw error;
            }
        },
        create: async (donationData) => {
            try {
                addAuthToken();
                const response = await fetch(`${API_CONFIG.BASE_URL}/donations`, {
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify(donationData)
                });
                return handleResponse(response);
            } catch (error) {
                console.error('Create donation error:', error);
                throw error;
            }
        },
        update: async (id, donationData) => {
            try {
                addAuthToken();
                const response = await fetch(`${API_CONFIG.BASE_URL}/donations/${id}`, {
                    method: 'PUT',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify(donationData)
                });
                return handleResponse(response);
            } catch (error) {
                console.error('Update donation error:', error);
                throw error;
            }
        },
        delete: async (id) => {
            try {
                addAuthToken();
                const response = await fetch(`${API_CONFIG.BASE_URL}/donations/${id}`, {
                    method: 'DELETE',
                    headers: API_CONFIG.HEADERS
                });
                return handleResponse(response);
            } catch (error) {
                console.error('Delete donation error:', error);
                throw error;
            }
        }
    }
};

export default API;
