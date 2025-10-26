/**
 * Enhanced API connection testing utility
 * This file provides detailed diagnostics for API connection issues
 */
import axios from 'axios';

/**
 * Tests direct connection to the API server
 * @returns {Promise<Object>} Test results
 */
export const testDirectConnection = async () => {
  try {
    console.group('🔌 Testing Direct API Connection');
    
    // Try connecting directly to the backend
    const baseUrl = 'http://localhost:3000';
    console.log(`Testing direct connection to ${baseUrl}...`);
    
    try {
      const response = await axios.get(baseUrl, { timeout: 5000 });
      console.log('Direct connection successful:', response.status);
      console.log('Response data:', response.data);
      console.groupEnd();
      return {
        success: true,
        message: 'Direct connection to backend server successful',
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('Direct connection failed:', error.message);
      console.groupEnd();
      return {
        success: false,
        message: 'Failed to connect directly to backend server',
        error: error.message
      };
    }
  } catch (error) {
    console.error('Test failed unexpectedly:', error);
    console.groupEnd();
    return {
      success: false,
      message: 'Test failed unexpectedly',
      error: error.message
    };
  }
};

/**
 * Tests the proxy connection through Vite
 * @returns {Promise<Object>} Test results
 */
export const testProxyConnection = async () => {
  try {
    console.group('🔄 Testing API Proxy Connection');
    
    console.log('Testing proxy connection through /api/v1...');
    try {
      const response = await axios.get('/api/v1', { timeout: 5000 });
      console.log('Proxy connection successful:', response.status);
      console.log('Response data:', response.data);
      console.groupEnd();
      return {
        success: true,
        message: 'Proxy connection to backend server successful',
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('Proxy connection failed:', error.message);
      console.groupEnd();
      return {
        success: false,
        message: 'Failed to connect through proxy to backend server',
        error: error.message
      };
    }
  } catch (error) {
    console.error('Test failed unexpectedly:', error);
    console.groupEnd();
    return { 
      success: false,
      message: 'Test failed unexpectedly',
      error: error.message
    };
  }
};

/**
 * Tests the auth endpoints with detailed logging
 */
export const testAuthEndpointsInDepth = async () => {
  console.group('🔐 Testing Authentication Endpoints In Depth');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  
  // Test registration
  console.log('Testing registration endpoint with detailed logging...');
  try {
    const registerData = {
      name: 'Test User',
      email: testEmail,
      password: testPassword
    };
    
    console.log('Registration request payload:', registerData);
    
    const registerResponse = await axios.post('/api/v1/auth/register', registerData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    console.log('Registration response status:', registerResponse.status);
    console.log('Registration response headers:', registerResponse.headers);
    console.log('Registration response data:', registerResponse.data);
    
    // Test login with the registered user
    console.log('Testing login endpoint with the registered user...');
    try {
      const loginData = {
        email: testEmail,
        password: testPassword
      };
      
      console.log('Login request payload:', loginData);
      
      const loginResponse = await axios.post('/api/v1/auth/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      console.log('Login response status:', loginResponse.status);
      console.log('Login response headers:', loginResponse.headers);
      console.log('Login response data:', loginResponse.data);
      
      // Extract token for testing protected endpoints
      let token = '';
      if (loginResponse.data.data && loginResponse.data.data.token) {
        token = loginResponse.data.data.token;
      } else if (loginResponse.data.token) {
        token = loginResponse.data.token;
      }
      
      if (token) {
        console.log('Token successfully extracted');
        
        // Test token with a protected endpoint
        try {
          console.log('Testing a protected endpoint with the token...');
          const profileResponse = await axios.get('/api/v1/auth/me', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000
          });
          
          console.log('Profile endpoint response:', profileResponse.status);
          console.log('Profile data:', profileResponse.data);
        } catch (error) {
          console.error('Protected endpoint test failed:', error.message);
          console.error('Error response:', error.response?.data);
        }
      } else {
        console.error('No token in login response');
      }
      
    } catch (error) {
      console.error('Login test failed:', error.message);
      console.error('Error details:', error.response?.data || error);
    }
    
  } catch (error) {
    console.error('Registration test failed:', error.message);
    console.error('Error details:', error.response?.data || error);
  }
  
  console.groupEnd();
};

/**
 * Run all connection tests
 */
export const runAllConnectionTests = async () => {
  const directResult = await testDirectConnection();
  const proxyResult = await testProxyConnection();
  
  if (directResult.success && proxyResult.success) {
    console.log('✅ Backend connectivity looks good!');
    await testAuthEndpointsInDepth();
  } else {
    console.error('❌ Backend connectivity issues detected.');
    console.log('Please check that:');
    console.log('1. Backend server is running on port 3000');
    console.log('2. No firewall or network issues are blocking the connection');
    console.log('3. CORS is properly configured on the backend');
  }
  
  return { directResult, proxyResult };
};

export default {
  testDirectConnection,
  testProxyConnection,
  testAuthEndpointsInDepth,
  runAllConnectionTests
};
