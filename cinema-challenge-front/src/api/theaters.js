import api from './index';

/**
 * Theaters API Service
 */
const theatersService = {
  /**
   * Get all theaters
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} Response from API with theaters data
   */
  getTheaters: async (params = {}) => {
    try {
      const response = await api.get('/theaters', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar salas de cinema' };
    }
  },

  /**
   * Get theater by ID
   * @param {String} id - Theater ID
   * @returns {Promise} Response from API with theater data
   */
  getTheaterById: async (id) => {
    try {
      const response = await api.get(`/theaters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar sala de cinema' };
    }
  },

  /**
   * Create a new theater (admin only)
   * @param {Object} theaterData - Theater data
   * @returns {Promise} Response from API
   */
  createTheater: async (theaterData) => {
    try {
      const response = await api.post('/theaters', theaterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar sala de cinema' };
    }
  },

  /**
   * Update a theater (admin only)
   * @param {String} id - Theater ID
   * @param {Object} theaterData - Updated theater data
   * @returns {Promise} Response from API
   */
  updateTheater: async (id, theaterData) => {
    try {
      const response = await api.put(`/theaters/${id}`, theaterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar sala de cinema' };
    }
  },

  /**
   * Delete a theater (admin only)
   * @param {String} id - Theater ID
   * @returns {Promise} Response from API
   */
  deleteTheater: async (id) => {
    try {
      const response = await api.delete(`/theaters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao excluir sala de cinema' };
    }
  }
};

export default theatersService;
