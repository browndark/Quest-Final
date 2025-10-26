# Developer Setup Guide

This guide provides detailed instructions for setting up the Cinema App Frontend development environment.

## Prerequisites

- **Node.js**: v16.0.0 or newer
- **npm**: v7.0.0 or newer (or **yarn**: v1.22.0 or newer)
- **Git**: For version control
- **Visual Studio Code**: Recommended IDE (with ESLint and Prettier extensions)
- **Backend API**: Access to the Cinema App Backend API (running locally or remote endpoint)

## Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/cinema-app-frontend.git

# Navigate to the project directory
cd cinema-app-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```
# API Configuration
VITE_API_URL=/api/v1  # Default: proxied to http://localhost:5000/api/v1

# Environment
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_ANALYTICS=false
```

## Development Workflow

### Start Development Server

```bash
# Using npm
npm start

# Using yarn
yarn start
```

This will start the Vite development server at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

### Preview Production Build

```bash
# Using npm
npm run preview

# Using yarn
yarn preview
```

## Project Structure Overview

```
cinema-app-frontend/
├── public/           # Static assets
├── src/
│   ├── api/          # API integration services
│   ├── components/   # Reusable components
│   ├── context/      # React Context providers
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Application pages
│   ├── styles/       # Global styles
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Main application component
│   └── main.jsx     # Application entry point
└── package.json
```

## Working with the API

- API requests are proxied to the backend server in development
- In `vite.config.js`, the proxy is configured to forward `/api` requests to `http://localhost:5000`
- If you need to connect to a different backend, update the proxy configuration in `vite.config.js`
- Authentication is handled via JWT stored in localStorage

## Code Style and Formatting

This project uses ESLint and Prettier for code quality and formatting:

- **Check Linting**: `npm run lint` or `yarn lint`
- **Fix Linting Issues**: `npm run lint:fix` or `yarn lint:fix`

## Recommended VS Code Extensions

For the best development experience, we recommend installing:

1. **ESLint**: JavaScript linting
2. **Prettier - Code formatter**: Automatic code formatting
3. **React Developer Tools**: React component inspection
4. **ES7+ React/Redux/React-Native snippets**: Helpful React code snippets
5. **Path Intellisense**: Autocomplete filenames in import statements

## Browser Development Tools

For debugging and development, make use of:

1. **React Developer Tools**: Chrome/Firefox extension for React debugging
2. **Redux DevTools** (if using Redux): State management inspection
3. **Axios Debug Log**: For API request/response monitoring

## Common Issues & Solutions

### API Connection Issues

If you encounter problems connecting to the backend API:

1. Verify the backend server is running
2. Check the proxy configuration in `vite.config.js`
3. Ensure the API base URL is correctly set
4. Check browser console for CORS errors

### Authentication Problems

If authentication is not working correctly:

1. Clear localStorage in your browser
2. Check token expiration logic
3. Verify the token is being sent in the Authorization header

### Build Issues

If encountering problems during build:

1. Delete the `node_modules` folder and `package-lock.json` file
2. Run `npm install` or `yarn` again
3. Clear your browser cache

## Running Mock API

For development without a backend, you can use a mock API:

1. Set `VITE_ENABLE_MOCK_API=true` in your `.env.local` file
2. The application will use mock data from `src/api/mock` instead of making real API calls

## Testing Routes

The application has different route types:

1. **Public Routes**: Accessible without authentication
2. **Protected User Routes**: Require user authentication 
3. **Admin Routes**: Require admin privileges

To test admin features, use an admin account or temporarily modify the `isAdmin` state in the `AuthContext`.

## Troubleshooting JSX in .js Files

If you encounter errors related to JSX syntax in `.js` files, you have two options:

### Option 1: Configure Vite to Process JSX in .js Files

The project is already configured to handle this through the `vite.config.mjs` file with the following settings:

```javascript
export default defineConfig({
  // ...other config
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/,  // .ts, .tsx, .js, .jsx
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
```

### Option 2: Rename .js Files with JSX to .jsx

You can use the provided script to rename problematic files:

```bash
node rename-jsx-files.mjs
```

This script will rename the Context provider files from `.js` to `.jsx`. After running it, remember to update any imports in your files that reference these renamed files.

### Identifying Files with JSX

To identify which `.js` files contain JSX and should be renamed, run:

```bash
node check-jsx-files.mjs
```

## Vite CJS Node API Deprecation Warning

If you see a warning about Vite's CJS build being deprecated, ensure you're using:
- The ESM version of the config file (`vite.config.mjs`)
- Added `"type": "module"` to package.json
- Updated npm scripts to use `--config vite.config.mjs`

This is already configured in the current project setup.

## Code Contribution

Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on contributing to this project.
