# Cinema App Frontend

This is a modern React-based frontend for the Cinema App, providing a seamless user experience for movie ticket booking and cinema management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Common Issues & Solutions](#common-issues--solutions)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Registration, login, and user profile management
- **Movie Browsing**: View all available movies with details
- **Session Booking**: Select seats and purchase tickets
- **Reservation Management**: View and manage ticket reservations
- **Admin Dashboard**: Comprehensive management tools for administrators
  - Movie management
  - Theater management
  - Session scheduling
  - Reservation management

## 💻 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **API Client**: Axios
- **Styling**: Styled Components and CSS
- **Icons**: React Icons
- **State Management**: React Context API

## 🗂️ Project Structure

```
cinema-app-frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/                # API integration services
│   │   ├── auth.js         # Authentication API
│   │   ├── movies.js       # Movies API
│   │   ├── reservations.js # Reservations API
│   │   ├── sessions.js     # Movie sessions API
│   │   └── theaters.js     # Theaters API
│   ├── components/
│   │   ├── common/         # Shared components
│   │   │   ├── Alert/
│   │   │   ├── Footer/
│   │   │   └── Header/
│   │   └── movies/         # Movie-specific components
│   │       └── MovieCard/
│   ├── context/            # React Context providers
│   │   ├── AlertContext.js
│   │   └── AuthContext.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useAlert.js
│   │   └── useAuth.js
│   ├── pages/              # Application pages
│   │   ├── Admin/          # Admin pages
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── MovieDetail/
│   │   └── ...
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx           # Application entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

## 📜 Available Scripts

- `npm start` or `yarn start`: Start the development server
- `npm run build` or `yarn build`: Build the app for production
- `npm run preview` or `yarn preview`: Preview the production build locally

## 🔌 API Integration

The application connects to a RESTful backend API with the following configuration:

- Base URL: `/api/v1` (proxied to `http://localhost:5000/api/v1` in development)
- JWT Authentication: Automatically adds Bearer token to authenticated requests
- Services:
  - Authentication (register, login, profile)
  - Movies (listing, details, search)
  - Sessions (movie showtimes)
  - Theaters (cinema locations)
  - Reservations (ticket bookings)

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage
- AuthContext provides authentication state throughout the application
- Protected routes redirect unauthenticated users to login
- Automatic token refresh mechanism for session persistence

## 👥 User Roles

The application supports multiple user roles:

1. **Guest Users**: Can browse movies and view details
2. **Registered Users**: Can book tickets and manage reservations
3. **Administrators**: Have access to the admin dashboard for full system management

## 📦 Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `dist/` directory, which can be deployed to any static hosting service.

## 🔧 Common Issues & Solutions

### JSX in .js Files

If you encounter an error about JSX syntax not being enabled in `.js` files:

```
Error: The JSX syntax extension is not currently enabled
```

This is fixed by configuring Vite to properly process JSX in `.js` files. The project already includes this configuration in `vite.config.mjs`.

### Entry Module Resolution Issues

If you encounter build errors like:

```
Could not resolve entry module "index.html"
```

or the application doesn't display anything when running:

1. Ensure `index.html` is in the root directory (not in the public folder)
2. Make sure `vite.config.mjs` has the correct root and build configuration:
   ```javascript
   export default defineConfig({
     // ...other config
     root: './', // Set the root to the current directory where index.html is located
     build: {
       outDir: 'dist',
     },
   })
   ```

### Missing Component Errors

If you encounter errors like:

```
Could not resolve "./pages/SeatSelection" from "src/App.jsx"
```

This means some imported components don't exist. Either:
1. Create the missing components
2. Comment out the imports and routes for components that don't exist yet

### Vite CJS Node API Deprecated Warning

If you see the following warning:

```
The CJS build of Vite's Node API is deprecated.
```

This is addressed by:
1. Using the ESM version of the Vite config (`vite.config.mjs`)
2. Adding `"type": "module"` to package.json
3. Specifying the config file in npm scripts with `--config vite.config.mjs`

### Other Common Issues

1. **Module Not Found Errors** - Make sure all dependencies are installed by running:
   ```bash
   npm install
   # or
   yarn
   ```

2. **Port Already in Use** - If port 3000 is already in use, you can change it in `vite.config.mjs` or specify a different port:
   ```bash
   npm start -- --port 3001
   ```

3. **API Connection Issues** - Ensure your backend server is running at http://localhost:5000 or update the proxy configuration in `vite.config.mjs`

4. **Clean Build** - If you're experiencing strange build issues, try cleaning the build:
   ```bash
   npm run clean && npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
