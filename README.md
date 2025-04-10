# NGO Management System

A comprehensive web application for managing Non-Governmental Organizations (NGOs), including member management, donation tracking, and event organization.

## Features

- User Authentication (Login/Signup)
- Member Management
- Donation Tracking
- Event Management
- Dashboard with Statistics
- Responsive Design

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ngo-management.git
cd ngo-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ngo_db
JWT_SECRET=your_jwt_secret_here
```

4. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Members
- GET /api/members - Get all members
- POST /api/members - Create a new member
- GET /api/members/:id - Get a specific member
- PUT /api/members/:id - Update a member
- DELETE /api/members/:id - Delete a member

### Donations
- GET /api/donations - Get all donations
- POST /api/donations - Create a new donation
- GET /api/donations/:id - Get a specific donation
- PUT /api/donations/:id - Update a donation
- DELETE /api/donations/:id - Delete a donation

### Events
- GET /api/events - Get all events
- POST /api/events - Create a new event
- GET /api/events/:id - Get a specific event
- PUT /api/events/:id - Update an event
- DELETE /api/events/:id - Delete an event

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/ngo-management](https://github.com/yourusername/ngo-management) 