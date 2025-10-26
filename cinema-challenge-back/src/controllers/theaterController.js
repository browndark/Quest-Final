const { Theater } = require('../models');

/**
 * @desc    Get all theaters
 * @route   GET /api/theaters
 * @access  Public
 */
exports.getTheaters = async (req, res, next) => {
  try {
    const theaters = await Theater.find();
    
    res.json({
      success: true,
      count: theaters.length,
      data: theaters
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get theater by ID
 * @route   GET /api/theaters/:id
 * @access  Public
 */
exports.getTheaterById = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id).populate('sessions');
    
    if (theater) {
      res.json({
        success: true,
        data: theater
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a theater
 * @route   POST /api/theaters
 * @access  Private/Admin
 */
exports.createTheater = async (req, res, next) => {
  try {
    const theater = await Theater.create(req.body);
    
    res.status(201).json({
      success: true,
      data: theater
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a theater
 * @route   PUT /api/theaters/:id
 * @access  Private/Admin
 */
exports.updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (theater) {
      const updatedTheater = await Theater.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        data: updatedTheater
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a theater
 * @route   DELETE /api/theaters/:id
 * @access  Private/Admin
 */
exports.deleteTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (theater) {
      await theater.deleteOne();
      
      res.json({
        success: true,
        message: 'Theater removed'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }
  } catch (error) {
    next(error);
  }
};
