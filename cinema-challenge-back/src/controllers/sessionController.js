const { Session, Movie, Theater } = require('../models');

/**
 * @desc    Get all sessions
 * @route   GET /api/sessions
 * @access  Public
 */
exports.getSessions = async (req, res, next) => {
  try {
    // Build query
    const query = {};
    
    // Filter by movie if provided
    if (req.query.movie) {
      query.movie = req.query.movie;
    }
    
    // Filter by theater if provided
    if (req.query.theater) {
      query.theater = req.query.theater;
    }
    
    // Filter by date if provided
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(req.query.date);
      endDate.setHours(23, 59, 59, 999);
      
      query.datetime = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const total = await Session.countDocuments(query);
    const sessions = await Session.find(query)
      .populate('movie', 'title poster duration')
      .populate('theater', 'name type')
      .sort({ datetime: 1 })
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
      count: sessions.length,
      pagination,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get session by ID
 * @route   GET /api/sessions/:id
 * @access  Public
 */
exports.getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('movie')
      .populate('theater');
    
    if (session) {
      res.json({
        success: true,
        data: session
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a session
 * @route   POST /api/sessions
 * @access  Private/Admin
 */
exports.createSession = async (req, res, next) => {
  try {
    const { movie: movieId, theater: theaterId, datetime, fullPrice, halfPrice } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Check if theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }
    
    // Generate seats based on theater capacity
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = Math.ceil(theater.capacity / rows.length);
    
    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        if (seats.length < theater.capacity) {
          seats.push({
            row: rows[i],
            number: j,
            status: 'available'
          });
        }
      }
    }
    
    // Create session
    const session = await Session.create({
      movie: movieId,
      theater: theaterId,
      datetime,
      fullPrice,
      halfPrice,
      seats
    });
    
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a session
 * @route   PUT /api/sessions/:id
 * @access  Private/Admin
 */
exports.updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (session) {
      // Don't allow updating seats directly
      if (req.body.seats) {
        delete req.body.seats;
      }
      
      const updatedSession = await Session.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        data: updatedSession
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a session
 * @route   DELETE /api/sessions/:id
 * @access  Private/Admin
 */
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (session) {
      await session.deleteOne();
      
      res.json({
        success: true,
        message: 'Session removed'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset session seats to available status
 * @route   PUT /api/sessions/:id/reset-seats
 * @access  Private/Admin
 */
exports.resetSessionSeats = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Reset all seats to available status
    session.seats = session.seats.map(seat => ({
      ...seat,
      status: 'available'
    }));
    
    await session.save();
    
    res.json({
      success: true,
      message: 'All seats reset to available status',
      data: session
    });
  } catch (error) {
    next(error);
  }
};
