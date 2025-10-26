// Test script for API integration
// Run this script to verify the integration between frontend and backend

import axios from 'axios';

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';
const TEST_USER = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'Password123!'
};

/**
 * Test all backend endpoints directly
 */
async function testBackendDirectly() {
  console.group('🔍 Testing Backend API Directly');
  
  try {
    // Test the root endpoint
    console.log('Testing root endpoint...');
    const rootResponse = await axios.get(API_BASE_URL);
    console.log('Root endpoint response:', rootResponse.data);
    
    // Register a test user
    console.log(`\nRegistering test user with email ${TEST_USER.email}...`);
    const registerResponse = await axios.post(
      `${API_BASE_URL}/auth/register`, 
      TEST_USER
    );
    console.log('Registration response:', registerResponse.data);
    
    // Login with the test user
    console.log('\nLogging in with test user...');
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`, 
      { email: TEST_USER.email, password: TEST_USER.password }
    );
    console.log('Login response:', loginResponse.data);
    
    // Extract token for authenticated requests
    const token = loginResponse.data.data.token;
    console.log('Auth token:', token);
    
    // Test fetching movies
    console.log('\nFetching movies...');
    const moviesResponse = await axios.get(`${API_BASE_URL}/movies`);
    console.log('Movies response:', moviesResponse.data);
    console.log(`Found ${moviesResponse.data.data.length} movies`);
    
    // Test authenticated endpoint
    console.log('\nTesting authenticated endpoint (user profile)...');
    const profileResponse = await axios.get(
      `${API_BASE_URL}/auth/me`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Profile response:', profileResponse.data);
    
    console.log('\n✅ Direct API tests completed successfully!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error('Error response:', error.response?.data || 'No response data');
  }
  
  console.groupEnd();
}

// Run the tests
testBackendDirectly().catch(console.error);

export { testBackendDirectly };
