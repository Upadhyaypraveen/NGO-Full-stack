// API configuration
const API_BASE_URL = '/api';

// API service class
class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Generic fetch method
    async fetch(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                this.clearToken();
                window.location.href = '/pages/login.html';
                return null;
            }

            const data = await response.json();
            return { ok: response.ok, data };
        } catch (error) {
            console.error('API Error:', error);
            return { ok: false, error: error.message };
        }
    }

    // Auth API methods
    async login(email, password) {
        return this.fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async signup(userData) {
        return this.fetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Dashboard API methods
    async getDashboardStats() {
        return this.fetch('/dashboard/stats');
    }

    // Members API methods
    async getMembers() {
        return this.fetch('/members');
    }

    async addMember(memberData) {
        return this.fetch('/members', {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
    }

    async updateMember(id, memberData) {
        return this.fetch(`/members/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memberData)
        });
    }

    async deleteMember(id) {
        return this.fetch(`/members/${id}`, {
            method: 'DELETE'
        });
    }

    // Donations API methods
    async getDonations() {
        return this.fetch('/donations');
    }

    async addDonation(donationData) {
        return this.fetch('/donations', {
            method: 'POST',
            body: JSON.stringify(donationData)
        });
    }

    async getDonationStats() {
        return this.fetch('/donations/stats');
    }

    // Events API methods
    async getEvents() {
        return this.fetch('/events');
    }

    async addEvent(eventData) {
        return this.fetch('/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }

    async updateEvent(id, eventData) {
        return this.fetch(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    }

    async deleteEvent(id) {
        return this.fetch(`/events/${id}`, {
            method: 'DELETE'
        });
    }
}

// Create and export API service instance
const api = new ApiService();
