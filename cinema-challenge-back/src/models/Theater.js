const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Theater:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the theater
 *         name:
 *           type: string
 *           description: The name of the theater (unique)
 *         capacity:
 *           type: number
 *           description: The seating capacity of the theater
 *           minimum: 1
 *         type:
 *           type: string
 *           enum: [standard, 3D, IMAX, VIP]
 *           description: The type of theater
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the theater was created
 *       example:
 *         _id: 60d0fe4f5311236168a109cc
 *         name: Theater 1
 *         capacity: 120
 *         type: IMAX
 *         createdAt: 2021-06-21T12:00:00.000Z
 */

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theater name is required'],
    trim: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  type: {
    type: String,
    required: [true, 'Theater type is required'],
    enum: ['standard', '3D', 'IMAX', 'VIP'],
    default: 'standard'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for sessions
theaterSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'theater',
  justOne: false
});

module.exports = mongoose.model('Theater', theaterSchema);
