import api from './index';

/**
 * Sessions API Service
 */
const sessionsService = {
  /**
   * Get all sessions with optional filtering
   * @param {Object} params - Query parameters for filtering (movieId, theaterId, date)
   * @returns {Promise} Response from API with sessions data
   */
  getSessions: async (params = {}) => {
    try {
      const response = await api.get('/sessions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar sessões' };
    }
  },

  /**
   * Get session by ID
   * @param {String} id - Session ID
   * @returns {Promise} Response from API with session data
   */
  getSessionById: async (id) => {
    try {
      const response = await api.get(`/sessions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar sessão' };
    }
  },

  /**
   * Create a new session (admin only)
   * @param {Object} sessionData - Session data
   * @returns {Promise} Response from API
   */
  createSession: async (sessionData) => {
    try {
      const response = await api.post('/sessions', sessionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar sessão' };
    }
  },

  /**
   * Update a session (admin only)
   * @param {String} id - Session ID
   * @param {Object} sessionData - Updated session data
   * @returns {Promise} Response from API
   */
  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/sessions/${id}`, sessionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar sessão' };
    }
  },
  /**
   * Delete a session (admin only)
   * @param {String} id - Session ID
   * @returns {Promise} Response from API
   */
  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/sessions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao excluir sessão' };
    }
  },
  /**
   * Reset all seats in a session to available status (admin only)
   * @param {String} id - Session ID
   * @returns {Promise} Response from API
   */
  resetSessionSeats: async (id) => {
    try {
      console.log(`Attempting to reset seats for session ID: ${id}`);
      const response = await api.put(`/sessions/${id}/reset-seats`);
      console.log('Reset seats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Reset seats error:', error.response?.data || error.message);
      // Include more detailed error information
      throw error.response?.data || { 
        success: false,
        message: error.response?.data?.message || 'Erro ao resetar assentos',
        details: error.message 
      };
    }
  },

  /**
   * Ensure session data has valid seats with the correct status
   * @param {Object} sessionData - Session data to validate and fix
   * @returns {Object} Fixed session data
   */
  ensureValidSeats: (sessionData) => {
    if (!sessionData || !sessionData.theater) {
      console.error('Invalid session data');
      return sessionData;
    }
    
    // If no seats found or seats array is empty, generate new seats
    if (!sessionData.seats || !Array.isArray(sessionData.seats) || sessionData.seats.length === 0) {
      console.warn('No valid seats found in session, generating default seats');
      
      const capacity = sessionData.theater.capacity || 60;
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seatsPerRow = Math.ceil(capacity / rows.length);
      
      sessionData.seats = [];
      
      for (let i = 0; i < rows.length; i++) {
        for (let j = 1; j <= seatsPerRow; j++) {
          if (sessionData.seats.length < capacity) {
            sessionData.seats.push({
              row: rows[i],
              number: j,
              status: 'available'
            });
          }
        }
      }
    } else {
      // Make sure all seats have the correct status - temp fix for development
      sessionData.seats = sessionData.seats.map(seat => ({
        ...seat,
        status: seat.status || 'available'
      }));
    }
    
    return sessionData;
  }
};

export default sessionsService;
