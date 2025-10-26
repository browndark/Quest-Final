# Cinema App API

A RESTful API for a cinema ticket booking system built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Movie management
- Theater management
- Session scheduling
- Seat reservation and booking
- Admin dashboard capabilities

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication mechanism
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cinema-app
```

## Running the Application

1. Start the server:
```bash
# Production mode
npm start

# Development mode with nodemon
npm run dev
```

2. Seed the database with sample data:
```bash
npm run seed
```

3. Seed the database with more data (auxiliary scripts):
```bash
node src/utils/seedData.js
node src/utils/seedMoreMovies.js
node src/utils/seedSessions.js
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `PUT /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Movies
- `GET /api/v1/movies` - Get all movies
- `GET /api/v1/movies/:id` - Get movie details
- `POST /api/v1/movies` - Create a new movie (admin only)
- `PUT /api/v1/movies/:id` - Update a movie (admin only)
- `DELETE /api/v1/movies/:id` - Delete a movie (admin only)

### Theaters
- `GET /api/v1/theaters` - Get all theaters
- `GET /api/v1/theaters/:id` - Get theater details
- `POST /api/v1/theaters` - Create a new theater (admin only)
- `PUT /api/v1/theaters/:id` - Update a theater (admin only)
- `DELETE /api/v1/theaters/:id` - Delete a theater (admin only)

### Sessions
- `GET /api/v1/sessions` - Get all sessions
- `GET /api/v1/sessions/:id` - Get session details
- `POST /api/v1/sessions` - Create a new session (admin only)
- `PUT /api/v1/sessions/:id` - Update a session (admin only)
- `DELETE /api/v1/sessions/:id` - Delete a session (admin only)

### Reservations
- `GET /api/v1/reservations` - Get all reservations (admin only)
- `GET /api/v1/reservations/me` - Get current user's reservations
- `GET /api/v1/reservations/:id` - Get reservation details
- `POST /api/v1/reservations` - Create a new reservation
- `PUT /api/v1/reservations/:id` - Update reservation status (admin only)
- `DELETE /api/v1/reservations/:id` - Delete a reservation (admin only)

## Sample Users

After seeding the database, you can use these accounts to test the API:

- Admin: admin@example.com / password123
- User: user@example.com / password123

## License

This project is licensed under the ISC License.
