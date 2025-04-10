// Import API
import API from './api.js';

// Authentication state management
let currentUser = null;

// Show error message
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.role = 'alert';
    errorDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    // Remove error after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
};

// Show success message
const showSuccess = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.role = 'alert';
    successDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove success message after 5 seconds
    setTimeout(() => successDiv.remove(), 5000);
};

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = '/pages/login.html';
        }
        return false;
    }
    return true;
}

// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const data = await API.auth.login({ email, password });
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/pages/dashboard.html';
                }, 1500);
            } catch (error) {
                showError(error.message || 'Login failed. Please try again.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: password
            };

            try {
                await API.auth.register(formData);
                showSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/pages/login.html';
                }, 1500);
            } catch (error) {
                showError(error.message || 'Registration failed. Please try again.');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            API.auth.logout();
        });
    }

    // Update navigation based on auth status
    const updateNavigation = () => {
        const token = localStorage.getItem('token');
        const loginNav = document.getElementById('loginNav');
        const registerNav = document.getElementById('registerNav');
        const logoutNav = document.getElementById('logoutNav');

        if (token) {
            loginNav?.classList.add('d-none');
            registerNav?.classList.add('d-none');
            logoutNav?.classList.remove('d-none');
        } else {
            loginNav?.classList.remove('d-none');
            registerNav?.classList.remove('d-none');
            logoutNav?.classList.add('d-none');
        }
    };

    // Initial navigation update
    updateNavigation();

    // Check authentication on page load
    if (window.location.pathname.includes('dashboard')) {
        if (!checkAuth()) {
            window.location.href = '/pages/login.html';
        }
    }
});
