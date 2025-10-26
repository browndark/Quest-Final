import api from '../api/index';
import { checkApiEndpoint } from './apiDiagnostics';
import { runAllConnectionTests } from './apiConnectionTest';

/**
 * Comprehensive API testing tool for diagnosing integration issues
 * This file helps identify common problems between frontend and backend
 */

/**
 * Test the connection to the server
 */
export const testServerConnection = async () => {
  try {
    const response = await fetch('/api/v1');
    console.log('Server connection test:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });
    return response.ok;
  } catch (error) {
    console.error('Server connection failed:', error.message);
    return false;
  }
};

/**
 * Test authentication flow (register and login)
 */
export const testAuthFlow = async () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  // Test user registration
  try {
    console.log(`Testing registration with email: ${testEmail}`);
    const registerData = {
      name: 'Test User',
      email: testEmail,
      password: testPassword
    };
    
    const registerResponse = await api.post('/auth/register', registerData);
    console.log('Registration test:', {
      success: true,
      status: registerResponse.status,
      data: registerResponse.data
    });
  } catch (error) {
    console.error('Registration test failed:', {
      success: false,
      status: error.response?.status,
      message: error.response?.data || error.message
    });
  }
  
  // Test user login
  try {
    console.log(`Testing login with email: ${testEmail}`);
    const loginData = {
      email: testEmail,
      password: testPassword
    };
    
    const loginResponse = await api.post('/auth/login', loginData);
    console.log('Login test:', {
      success: true,
      status: loginResponse.status,
      data: loginResponse.data
    });
    
    // Return the token for further tests
    return loginResponse.data.data?.token;
  } catch (error) {
    console.error('Login test failed:', {
      success: false,
      status: error.response?.status,
      message: error.response?.data || error.message
    });
    return null;
  }
};

/**
 * Test Movie API endpoints
 */
export const testMovieEndpoints = async (token) => {
  try {
    console.log('Testing Movies API endpoint');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const moviesResponse = await api.get('/movies', { headers });
    
    console.log('Movies API test:', {
      success: true,
      status: moviesResponse.status,
      count: moviesResponse.data.data?.length || 0,
      data: moviesResponse.data
    });
  } catch (error) {
    console.error('Movies API test failed:', {
      success: false,
      status: error.response?.status,
      message: error.response?.data || error.message
    });
  }
};

/**
 * Run all API tests in sequence
 */
export const runAllTests = async () => {
  console.group('🔍 API Integration Test Tool');
  
  // Run the enhanced connection tests first
  console.log('Running enhanced connection tests...');
  await runAllConnectionTests();
  
  // Check server connection
  const isServerConnected = await testServerConnection();
  if (!isServerConnected) {
    console.warn('⚠️ Server connection failed. Check if the backend server is running on port 3000');
  }
  
  // Test auth flow
  const token = await testAuthFlow();
  
  // Test movie endpoints
  await testMovieEndpoints(token);
  
  // Test endpoints using the other utility
  await checkCommonEndpoints();

  console.log('✅ All tests completed. Check the console for detailed results.');
  console.groupEnd();
};

/**
 * Check common API endpoints that might be failing
 */
export const checkCommonEndpoints = async () => {
  console.group('Testing Common Endpoints:');
  
  // Check API endpoints for common routes
  const endpoints = [
    '/',
    '/auth/register',
    '/auth/login',
    '/movies',
    '/theaters',
    '/sessions'
  ];
  
  for (const endpoint of endpoints) {
    const result = await checkApiEndpoint(endpoint);
    console.log(`${endpoint}:`, result);
  }
  
  console.groupEnd();
};

export default {
  runAllTests,
  testServerConnection,
  testAuthFlow,
  testMovieEndpoints,
  checkCommonEndpoints
};
