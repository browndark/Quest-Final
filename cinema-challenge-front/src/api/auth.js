import api from './index';

/**
 * Authentication API Service
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data including name, email, and password
   * @returns {Promise} Response from API
   */  register: async (userData) => {
    try {
      console.log('Registering user with endpoint:', '/auth/register');
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'Erro ao registrar usuário', details: error.message };
    }
  },  /**
   * Login user
   * @param {Object} credentials - User credentials with email and password
   * @returns {Promise} Response from API with user data and token
   */  login: async (credentials) => {
    try {
      console.log('Logging in with endpoint:', '/auth/login');
      console.log('Login credentials:', credentials);
      
      const response = await api.post('/auth/login', credentials);
      console.log('Raw login response:', response);
      console.log('Login response data:', response.data);
      
      // The backend returns a structure like:
      // { success: true, data: { _id, name, email, role, token } }
      if (response.data && response.data.success && response.data.data) {
        const userData = response.data.data;
        console.log('Storing user data in localStorage:', userData);
        
        // Store token in localStorage
        localStorage.setItem('token', userData.token);
        
        // Store user data without the token in localStorage
        const userForStorage = { ...userData };
        delete userForStorage.token; // Remove token from user object
        localStorage.setItem('user', JSON.stringify(userForStorage));
        
        console.log('LocalStorage after login:', {
          token: localStorage.getItem('token') ? 'exists' : 'missing',
          user: localStorage.getItem('user')
        });
      } else {
        console.error('Unexpected login response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      // Make sure to extract the error message from the response if possible
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao fazer login';
      throw { 
        success: false, 
        message: errorMsg, 
        details: error.response?.data || error.message 
      };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile
   * @returns {Promise} Response from API with user profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao obter perfil do usuário' };
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - User data to update (name, currentPassword, newPassword)
   * @returns {Promise} Response from API with updated user data
   */
  updateProfile: async (userData) => {
    try {
      console.log('Updating profile with data:', userData);
      const response = await api.put('/auth/profile', userData);
      
      // If the update includes a new token, update it in localStorage
      if (response.data.success && response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        
        // Update the user data in localStorage
        const userForStorage = { ...response.data.data };
        delete userForStorage.token; // Remove token from user object
        localStorage.setItem('user', JSON.stringify(userForStorage));
      }
      
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data || { message: 'Erro ao atualizar perfil do usuário' };
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current user data from localStorage
   * @returns {Object|null} User data or null if not authenticated
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is admin
   * @returns {Boolean} True if user is admin
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

export default authService;
