// Client-side router
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const path = e.target.getAttribute('data-route');
                this.navigate(path);
            }
        });

        // Handle initial route
        this.handleRoute(window.location.pathname);
    }

    async handleRoute(path) {
        // Check if route exists
        const route = this.routes.find(r => r.path === path);
        
        if (!route) {
            // Handle 404
            window.location.href = '/pages/404.html';
            return;
        }

        // Check authentication if required
        if (route.requiresAuth && !this.isAuthenticated()) {
            window.location.href = '/pages/login.html';
            return;
        }

        // Load the route content
        try {
            const response = await fetch(route.template);
            const content = await response.text();
            
            // Update the main content area
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.innerHTML = content;
            }

            // Update current route
            this.currentRoute = route;

            // Call the route's onEnter function if it exists
            if (route.onEnter) {
                route.onEnter();
            }
        } catch (error) {
            console.error('Error loading route:', error);
        }
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

// Define routes
const routes = [
    {
        path: '/',
        template: '/index.html',
        requiresAuth: false
    },
    {
        path: '/pages/login.html',
        template: '/pages/login.html',
        requiresAuth: false
    },
    {
        path: '/pages/signup.html',
        template: '/pages/signup.html',
        requiresAuth: false
    },
    {
        path: '/pages/dashboard.html',
        template: '/pages/dashboard.html',
        requiresAuth: true,
        onEnter: () => {
            // Load dashboard data when entering dashboard
            loadDashboardData();
        }
    }
];

// Initialize router
const router = new Router(routes);
