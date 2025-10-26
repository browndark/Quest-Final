# API Integration Documentation

This document describes the API integration between the Cinema App Frontend and Backend.

## API Configuration

- **Base URL**: `/api/v1` (proxied to `http://localhost:5000/api/v1` in development)
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer token

## Request Interceptor

All authenticated requests automatically include the JWT token from localStorage:

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

## Error Handling

The API services include consistent error handling, with responses formatted as:

```javascript
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  throw error.response?.data || { message: 'Default error message' };
}
```

## Available Endpoints

### Authentication API

#### Register User

```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### Login

```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### Get Current User

```
GET /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Update Profile

```
PUT /api/v1/auth/profile
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "user"
  }
}
```

### Movies API

#### Get All Movies

```
GET /api/v1/movies
```

**Query Parameters:**
- `title` (optional): Filter by title
- `genre` (optional): Filter by genre
- `status` (optional): Filter by status (now_showing, coming_soon)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page

**Response:**
```json
{
  "success": true,
  "count": 20,
  "pagination": {
    "current": 1,
    "total": 3
  },
  "data": [
    {
      "id": "movie_id",
      "title": "Movie Title",
      "description": "Movie description...",
      "duration": 120,
      "genre": ["Action", "Adventure"],
      "releaseDate": "2025-01-01",
      "director": "Director Name",
      "cast": ["Actor 1", "Actor 2"],
      "posterUrl": "https://example.com/poster.jpg",
      "trailerUrl": "https://youtube.com/watch?v=trailer",
      "rating": "PG-13",
      "status": "now_showing"
    },
    // More movies...
  ]
}
```

#### Get Movie by ID

```
GET /api/v1/movies/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "movie_id",
    "title": "Movie Title",
    "description": "Movie description...",
    "duration": 120,
    "genre": ["Action", "Adventure"],
    "releaseDate": "2025-01-01",
    "director": "Director Name",
    "cast": ["Actor 1", "Actor 2"],
    "posterUrl": "https://example.com/poster.jpg",
    "trailerUrl": "https://youtube.com/watch?v=trailer",
    "rating": "PG-13",
    "status": "now_showing",
    "sessions": [
      {
        "id": "session_id",
        "startTime": "2025-06-17T18:30:00Z",
        "endTime": "2025-06-17T20:30:00Z",
        "theater": {
          "id": "theater_id",
          "name": "Theater 1"
        },
        "ticketPrice": 15.99,
        "availableSeats": 45
      }
      // More sessions...
    ]
  }
}
```

#### Create Movie (Admin Only)

```
POST /api/v1/movies
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "title": "New Movie",
  "description": "Movie description...",
  "duration": 130,
  "genre": ["Sci-Fi", "Thriller"],
  "releaseDate": "2025-08-15",
  "director": "Director Name",
  "cast": ["Actor 1", "Actor 2"],
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://youtube.com/watch?v=trailer",
  "rating": "PG-13",
  "status": "coming_soon"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_movie_id",
    "title": "New Movie",
    "description": "Movie description...",
    "duration": 130,
    "genre": ["Sci-Fi", "Thriller"],
    "releaseDate": "2025-08-15",
    "director": "Director Name",
    "cast": ["Actor 1", "Actor 2"],
    "posterUrl": "https://example.com/poster.jpg",
    "trailerUrl": "https://youtube.com/watch?v=trailer",
    "rating": "PG-13",
    "status": "coming_soon"
  }
}
```

### Sessions API

#### Get Sessions by Movie ID

```
GET /api/v1/sessions?movieId=:movieId
```

**Query Parameters:**
- `movieId` (required): Movie ID to filter sessions
- `date` (optional): Date to filter sessions (YYYY-MM-DD)
- `theaterId` (optional): Theater ID to filter sessions
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "session_id",
      "movie": {
        "id": "movie_id",
        "title": "Movie Title",
        "posterUrl": "https://example.com/poster.jpg",
        "duration": 120,
        "rating": "PG-13"
      },
      "theater": {
        "id": "theater_id",
        "name": "Theater 1",
        "location": "Main Floor"
      },
      "startTime": "2025-06-17T18:30:00Z",
      "endTime": "2025-06-17T20:30:00Z",
      "ticketPrice": 15.99,
      "totalSeats": 80,
      "availableSeats": 45
    }
    // More sessions...
  ]
}
```

#### Get Session by ID with Seats

```
GET /api/v1/sessions/:id/seats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session_id",
    "movie": {
      "id": "movie_id",
      "title": "Movie Title",
      "posterUrl": "https://example.com/poster.jpg",
      "duration": 120,
      "rating": "PG-13"
    },
    "theater": {
      "id": "theater_id",
      "name": "Theater 1",
      "layout": {
        "rows": 10,
        "seatsPerRow": 8
      }
    },
    "startTime": "2025-06-17T18:30:00Z",
    "endTime": "2025-06-17T20:30:00Z",
    "ticketPrice": 15.99,
    "seats": [
      {
        "id": "seat_A1",
        "row": "A",
        "number": 1,
        "status": "available",
        "type": "standard"
      },
      {
        "id": "seat_A2",
        "row": "A",
        "number": 2,
        "status": "reserved",
        "type": "standard"
      }
      // More seats...
    ]
  }
}
```

### Reservations API

#### Create Reservation

```
POST /api/v1/reservations
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "sessionId": "session_id",
  "seatIds": ["seat_A3", "seat_A4"],
  "paymentInfo": {
    "method": "credit_card",
    "cardNumber": "************1234",
    "expiryDate": "12/26",
    "cardHolderName": "User Name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reservation_id",
    "confirmationCode": "ABC123XYZ",
    "session": {
      "id": "session_id",
      "movie": {
        "id": "movie_id",
        "title": "Movie Title"
      },
      "startTime": "2025-06-17T18:30:00Z",
      "theater": {
        "id": "theater_id",
        "name": "Theater 1"
      }
    },
    "seats": [
      {
        "id": "seat_A3",
        "row": "A",
        "number": 3
      },
      {
        "id": "seat_A4",
        "row": "A",
        "number": 4
      }
    ],
    "status": "confirmed",
    "totalPrice": 31.98,
    "createdAt": "2025-06-15T14:22:10Z"
  }
}
```

#### Get User Reservations

```
GET /api/v1/reservations
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "reservation_id_1",
      "confirmationCode": "ABC123XYZ",
      "session": {
        "id": "session_id",
        "movie": {
          "id": "movie_id",
          "title": "Movie Title",
          "posterUrl": "https://example.com/poster.jpg"
        },
        "startTime": "2025-06-17T18:30:00Z",
        "theater": {
          "name": "Theater 1"
        }
      },
      "seats": [
        { "row": "A", "number": 3 },
        { "row": "A", "number": 4 }
      ],
      "status": "confirmed",
      "totalPrice": 31.98,
      "createdAt": "2025-06-15T14:22:10Z"
    },
    // More reservations...
  ]
}
```

### Theater API

#### Get All Theaters

```
GET /api/v1/theaters
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "theater_id",
      "name": "Theater 1",
      "location": "Main Floor",
      "capacity": 80,
      "features": ["Dolby Atmos", "4K Projection"]
    },
    // More theaters...
  ]
}
```

## Error Responses

All API endpoints return consistent error formats:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description message",
    "details": {} // Optional additional details
  }
}
```

Common error codes:

- `INVALID_CREDENTIALS`: Email or password incorrect
- `AUTH_REQUIRED`: Authentication required
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `SEAT_UNAVAILABLE`: Requested seats are no longer available
- `PAYMENT_FAILED`: Payment processing failed
- `SERVER_ERROR`: Internal server error

## Testing the API

For testing purposes, you can use the following account:

**Regular User:**
- Email: user@example.com
- Password: password123

**Admin User:**
- Email: admin@example.com
- Password: admin123
