const { Movie } = require('../models');

/**
 * @desc    Get all movies
 * @route   GET /api/movies
 * @access  Public
 */
exports.getMovies = async (req, res, next) => {
  try {
    // Build query
    const query = {};
    
    // Filter by genre if provided
    if (req.query.genre) {
      query.genres = { $in: [req.query.genre] };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
      // Execute query
    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .select('_id customId title synopsis director genres duration classification poster releaseDate')
      .sort({ releaseDate: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Pagination result
    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.json({
      success: true,
      count: movies.length,
      pagination,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
exports.getMovieById = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    
    // Check if the ID is a valid MongoDB ObjectID
    const isValidObjectId = movieId.match(/^[0-9a-fA-F]{24}$/);
    
    let movie;
    
    if (isValidObjectId) {
      // If it's a valid ObjectID, find by ID
      movie = await Movie.findById(movieId).populate('sessions');
    } else {
      // Handle numeric or non-standard IDs - try to find by custom field
      // This allows for both MongoDB ObjectIDs and custom IDs like '1', '2', etc.
      movie = await Movie.findOne({ 
        $or: [
          { customId: movieId },  // If you have a customId field
          { title: new RegExp(`^${movieId}$`, 'i') }  // Match by title for demo purposes
        ]
      }).populate('sessions');
    }
    
    if (movie) {
      res.json({
        success: true,
        data: movie
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
  } catch (error) {
    // More graceful error handling
    res.status(400).json({
      success: false,
      message: 'Invalid movie ID format or movie not found',
      error: error.message
    });
  }
};

/**
 * @desc    Create a movie
 * @route   POST /api/movies
 * @access  Private/Admin
 */
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    
    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a movie
 * @route   PUT /api/movies/:id
 * @access  Private/Admin
 */
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (movie) {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        data: updatedMovie
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a movie
 * @route   DELETE /api/movies/:id
 * @access  Private/Admin
 */
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (movie) {
      await movie.deleteOne();
      
      res.json({
        success: true,
        message: 'Movie removed'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
  } catch (error) {
    next(error);
  }
};
