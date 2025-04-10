// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('content').classList.toggle('active');
        });
    }

    // Load dashboard data
    if (window.location.pathname.includes('dashboard')) {
        loadDashboardData();
    }
});

// Load dashboard statistics and data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update dashboard statistics
function updateDashboardStats(data) {
    const stats = {
        members: document.querySelector('.card.bg-primary .card-text'),
        donations: document.querySelector('.card.bg-success .card-text'),
        events: document.querySelector('.card.bg-warning .card-text'),
        volunteers: document.querySelector('.card.bg-info .card-text')
    };

    if (stats.members) stats.members.textContent = data.totalMembers || '0';
    if (stats.donations) stats.donations.textContent = `$${data.totalDonations || '0'}`;
    if (stats.events) stats.events.textContent = data.upcomingEvents || '0';
    if (stats.volunteers) stats.volunteers.textContent = data.activeVolunteers || '0';
}

// Quick action buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-primary')) {
        // Add New Member
        window.location.href = '/pages/members/add.html';
    } else if (e.target.closest('.btn-success')) {
        // Record Donation
        window.location.href = '/pages/donations/add.html';
    } else if (e.target.closest('.btn-warning')) {
        // Create Event
        window.location.href = '/pages/events/add.html';
    } else if (e.target.closest('.btn-info')) {
        // Generate Report
        window.location.href = '/pages/reports/generate.html';
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
