import api from './index';

/**
 * Movies API Service
 */
const moviesService = {  /**
   * Get all movies with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} Response from API with movies data
   */
  getMovies: async (params = {}) => {
    try {
      console.log('Fetching movies with params:', params);
      const response = await api.get('/movies', { params });
      console.log('Movies response:', response.data);
      
      // Backend returns movies in format:
      // { success: true, count: X, pagination: {...}, data: [] }
      // So we should return the entire response.data
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao buscar filmes';
      throw { 
        success: false, 
        message: errorMsg, 
        data: [] 
      };
    }
  },
  /**
   * Get movie by ID
   * @param {String} id - Movie ID
   * @returns {Promise} Response from API with movie data
   */
  getMovieById: async (id) => {
    try {
      console.log(`API Request: Getting movie details for ID ${id}`);
      const response = await api.get(`/movies/${id}`);
      console.log('API Response for movie details:', response.data);
      
      // Return the data directly as it's already in the right format
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${id}:`, error);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao buscar filme';
      
      // Return a formatted error object
      throw { 
        success: false, 
        message: errorMsg,
        error: error.response?.data || error.message 
      };
    }
  },

  /**
   * Create a new movie (admin only)
   * @param {Object} movieData - Movie data
   * @returns {Promise} Response from API
   */
  createMovie: async (movieData) => {
    try {
      const response = await api.post('/movies', movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar filme' };
    }
  },

  /**
   * Update a movie (admin only)
   * @param {String} id - Movie ID
   * @param {Object} movieData - Updated movie data
   * @returns {Promise} Response from API
   */
  updateMovie: async (id, movieData) => {
    try {
      const response = await api.put(`/movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar filme' };
    }
  },

  /**
   * Delete a movie (admin only)
   * @param {String} id - Movie ID
   * @returns {Promise} Response from API
   */
  deleteMovie: async (id) => {
    try {
      const response = await api.delete(`/movies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao excluir filme' };
    }
  }
};

export default moviesService;
