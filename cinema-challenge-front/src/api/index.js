import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api/v1', // This will be proxied to http://localhost:3000/api/v1 by Vite
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to detect connection issues faster
  timeout: 10000,
});

// Debug interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} for ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Log detailed error information for debugging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized errors - redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
