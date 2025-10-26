/**
 * Utility functions for debugging and API diagnostics
 */

/**
 * Check the status of an API endpoint
 * @param {string} endpoint - The API endpoint to check
 * @returns {Promise<Object>} Response with status information
 */
export const checkApiEndpoint = async (endpoint) => {
  try {
    const response = await fetch(`/api/v1${endpoint}`);
    const status = response.status;
    const ok = response.ok;
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
    
    return {
      endpoint,
      status,
      ok,
      data,
      message: ok ? 'Endpoint is available' : `Endpoint returned status: ${status}`
    };
  } catch (error) {
    return {
      endpoint,
      status: null,
      ok: false,
      data: null,
      message: `Error accessing endpoint: ${error.message}`
    };
  }
};

/**
 * Display API diagnostics in console
 */
export const runApiDiagnostics = async () => {
  console.group('API Diagnostics');
  
  // Check base API
  const baseCheck = await checkApiEndpoint('/');
  console.log('Base API:', baseCheck);
  
  // Check auth endpoints
  const registerCheck = await checkApiEndpoint('/auth/register');
  console.log('Register Endpoint:', registerCheck);
  
  const loginCheck = await checkApiEndpoint('/auth/login');
  console.log('Login Endpoint:', loginCheck);
  
  // Check movies endpoint
  const moviesCheck = await checkApiEndpoint('/movies');
  console.log('Movies Endpoint:', moviesCheck);
  
  console.groupEnd();
};

export default {
  checkApiEndpoint,
  runApiDiagnostics
};
