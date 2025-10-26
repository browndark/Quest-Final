# Cinema App Frontend Documentation

## Application Overview

The Cinema App is a comprehensive movie theater management system that allows users to browse movies, book seats, and manage their reservations. Administrators can manage movies, theaters, sessions, and reservations.

## Architecture

The application follows a modern React architecture with the following key patterns:

- **Component-Based Structure**: Modular components for reusability and maintainability
- **Context API for State Management**: Global state managed via React Context
- **Custom Hooks**: Encapsulated logic for authentication, alerts, etc.
- **API Service Layer**: Centralized API communication with Axios
- **Route Protection**: Secured routes based on authentication state and user roles

## Core Components

### Context Providers

#### AuthContext

The `AuthContext` provides authentication state and methods throughout the application:

- `user`: Current authenticated user object
- `isAuthenticated`: Boolean indicating authentication status
- `isAdmin`: Boolean indicating if user has admin privileges
- `login()`: Authenticate a user
- `register()`: Create a new user
- `logout()`: End current session
- `updateProfile()`: Update user information

#### AlertContext

The `AlertContext` handles application notifications:

- `showAlert()`: Display a notification
- `hideAlert()`: Dismiss a notification
- Alert types: success, error, warning, info

### API Services

#### Authentication API (`auth.js`)

- User registration
- User login
- Password reset
- Token management
- User profile operations

#### Movies API (`movies.js`)

- Fetch movie listings with filtering
- Get movie details
- Admin operations (CRUD for movies)

#### Sessions API (`sessions.js`)

- List movie sessions by movie, date, or theater
- Get session details with seat availability
- Admin operations for session management

#### Reservations API (`reservations.js`)

- Create new reservation
- View user reservations
- Cancel reservation
- Admin operations for reservation management

#### Theaters API (`theaters.js`)

- Get theater listings
- View theater details with seating layout
- Admin operations for theater management

### User Flow

1. **Public Browse**
   - View homepage with featured movies
   - Browse movie listings with filters
   - View movie details

2. **Authentication**
   - Register new account
   - Login with credentials
   - Reset forgotten password

3. **Booking Process**
   - Select movie and session
   - Choose seats from available options
   - Complete payment
   - Receive booking confirmation

4. **User Account**
   - View profile information
   - Update account details
   - View reservation history
   - Cancel upcoming reservations

5. **Admin Operations**
   - Manage movies (add, edit, delete)
   - Configure theaters and seating layouts
   - Schedule movie sessions
   - View and manage all reservations
   - View analytics and reports

## Frontend Routes

### Public Routes

- `/` - Homepage with featured movies
- `/login` - User login
- `/register` - New user registration
- `/movies/:id` - Movie details

### Protected User Routes

- `/sessions/:id/seats` - Seat selection
- `/checkout` - Payment and booking confirmation
- `/profile` - User profile management
- `/reservations` - User's reservation history

### Admin Routes

- `/admin` - Admin dashboard
- `/admin/movies` - Movie management
- `/admin/theaters` - Theater management
- `/admin/sessions` - Session scheduling
- `/admin/reservations` - Reservation management

## Development Guidelines

### Adding New Features

1. Create new components in the appropriate directory
2. Update or create API services as needed
3. Add new routes to App.jsx
4. Update documentation with new features

### Code Style

- Use functional components with hooks
- Follow React best practices
- Document complex functions with JSDoc comments
- Use descriptive variable and function names
- Organize imports consistently

### Testing

Before submitting changes:

1. Ensure all features work as expected
2. Test across different screen sizes (responsive design)
3. Verify proper error handling
4. Check for console errors

## Backend Integration

The frontend communicates with a RESTful API backend:

- Base URL: `/api/v1`
- Authentication: Bearer token in Authorization header
- Error handling: Consistent error response format
- Request/Response format: JSON

API documentation is available separately in the backend repository.

## Deployment

The application is built with Vite, which creates optimized production assets:

1. Run `npm run build` or `yarn build`
2. Deploy the contents of the `dist/` directory to a static hosting service
3. Ensure proper configuration for SPA routing (redirects to index.html)

## Environment Configuration

The application can be configured via environment variables:

- `VITE_API_URL`: Base API URL (defaults to proxied `/api/v1`)
- `VITE_APP_ENV`: Environment (development, staging, production)

Create a `.env.local` file in the project root to override these settings during development.

## Troubleshooting

Common issues and solutions:

1. **Authentication Issues**
   - Check localStorage for token presence
   - Verify token expiration
   - Clear browser storage and re-login

2. **API Connection Problems**
   - Verify API server is running
   - Check proxy configuration in vite.config.js
   - Inspect network requests in browser devtools

3. **Rendering Problems**
   - Check for React key warnings
   - Verify state updates are triggering re-renders
   - Look for conditional rendering issues
