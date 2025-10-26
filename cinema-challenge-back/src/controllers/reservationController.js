const { Reservation, Session, User } = require('../models');

/**
 * @desc    Get all reservations
 * @route   GET /api/reservations
 * @access  Private/Admin
 */
exports.getReservations = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const total = await Reservation.countDocuments();
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate({
        path: 'session',
        populate: {
          path: 'movie theater',
          select: 'title name'
        }
      })
      .sort({ createdAt: -1 })
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
      count: reservations.length,
      pagination,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user reservations
 * @route   GET /api/reservations/me
 * @access  Private
 */
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate({
        path: 'session',
        populate: {
          path: 'movie theater',
          select: 'title name poster datetime'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reservation by ID
 * @route   GET /api/reservations/:id
 * @access  Private
 */
exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'session',
        populate: {
          path: 'movie theater',
          select: 'title name poster'
        }
      });
    
    // Check if reservation exists
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if user owns the reservation or is admin
    if (reservation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this reservation'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a reservation
 * @route   POST /api/reservations
 * @access  Private
 */
exports.createReservation = async (req, res, next) => {
  try {
    const { session: sessionId, seats, paymentMethod = 'credit_card' } = req.body;
    
    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if seats are available
    const unavailableSeats = [];
    
    for (const seat of seats) {
      const sessionSeat = session.seats.find(
        s => s.row === seat.row && s.number === seat.number
      );
      
      if (!sessionSeat || sessionSeat.status !== 'available') {
        unavailableSeats.push(`${seat.row}${seat.number}`);
      }
    }
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following seats are not available: ${unavailableSeats.join(', ')}`
      });
    }
    
    // Calculate total price
    let totalPrice = 0;
    for (const seat of seats) {
      totalPrice += seat.type === 'half' ? session.halfPrice : session.fullPrice;
    }
    
    // Create reservation with payment details
    const reservation = await Reservation.create({
      user: req.user._id,
      session: sessionId,
      seats,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'completed', // Auto-complete payment for demo
      paymentMethod: paymentMethod,
      paymentDate: new Date()
    });
    
    // Update seat status in session
    for (const seat of seats) {
      const seatIndex = session.seats.findIndex(
        s => s.row === seat.row && s.number === seat.number
      );
      
      if (seatIndex !== -1) {
        session.seats[seatIndex].status = 'occupied';
      }
    }
    
    await session.save();
    
    // Populate session and movie data for reservation response
    await reservation.populate({
      path: 'session',
      populate: {
        path: 'movie theater',
        select: 'title name poster'
      }
    });
    
    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update reservation status
 * @route   PUT /api/reservations/:id
 * @access  Private/Admin
 */
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (pending, confirmed, cancelled)'
      });
    }
    
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Update seats status in session if status changes to cancelled
    if (status === 'cancelled' && reservation.status !== 'cancelled') {
      const session = await Session.findById(reservation.session);
      
      if (session) {
        for (const seat of reservation.seats) {
          const seatIndex = session.seats.findIndex(
            s => s.row === seat.row && s.number === seat.number
          );
          
          if (seatIndex !== -1) {
            session.seats[seatIndex].status = 'available';
          }
        }
        
        await session.save();
      }
    }
    
    reservation.status = status;
    await reservation.save();
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a reservation
 * @route   DELETE /api/reservations/:id
 * @access  Private/Admin
 */
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Free up seats in the session
    const session = await Session.findById(reservation.session);
    
    if (session) {
      for (const seat of reservation.seats) {
        const seatIndex = session.seats.findIndex(
          s => s.row === seat.row && s.number === seat.number
        );
        
        if (seatIndex !== -1) {
          session.seats[seatIndex].status = 'available';
        }
      }
      
      await session.save();
    }
    
    await reservation.deleteOne();
    
    res.json({
      success: true,
      message: 'Reservation removed'
    });
  } catch (error) {
    next(error);
  }
};
