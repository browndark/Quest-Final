const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Seat:
 *       type: object
 *       required:
 *         - row
 *         - number
 *       properties:
 *         row:
 *           type: string
 *           description: Row identifier (e.g., A, B, C)
 *         number:
 *           type: number
 *           description: Seat number in the row
 *         status:
 *           type: string
 *           enum: [available, reserved, occupied]
 *           default: available
 *           description: Current seat status
 *       example:
 *         row: "B"
 *         number: 12
 *         status: "available"
 *
 *     Session:
 *       type: object
 *       required:
 *         - movie
 *         - theater
 *         - datetime
 *         - fullPrice
 *         - halfPrice
 *         - seats
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the session
 *         movie:
 *           type: string
 *           description: Reference to the movie being shown (Movie ID)
 *         theater:
 *           type: string
 *           description: Reference to the theater where the session takes place (Theater ID)
 *         datetime:
 *           type: string
 *           format: date-time
 *           description: Date and time of the movie session
 *         fullPrice:
 *           type: number
 *           description: Full ticket price
 *           minimum: 0
 *         halfPrice:
 *           type: number
 *           description: Half ticket price (for students, seniors, etc.)
 *           minimum: 0
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Seat'
 *           description: Array of seat objects representing the theater's seating layout
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the session was created
 *       example:
 *         _id: 60d0fe4f5311236168a109cd
 *         movie: "60d0fe4f5311236168a109cb"
 *         theater: "60d0fe4f5311236168a109cc"
 *         datetime: "2025-06-20T18:30:00.000Z"
 *         fullPrice: 20
 *         halfPrice: 10
 *         seats: [
 *           { row: "A", number: 1, status: "available" },
 *           { row: "A", number: 2, status: "reserved" }
 *         ]
 *         createdAt: "2021-06-21T12:00:00.000Z"
 */

// Seat schema for the seats array
const seatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied'],
    default: 'available'
  }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater is required']
  },
  datetime: {
    type: Date,
    required: [true, 'Session date and time are required']
  },
  fullPrice: {
    type: Number,
    required: [true, 'Full ticket price is required'],
    min: [0, 'Price cannot be negative']
  },
  halfPrice: {
    type: Number,
    required: [true, 'Half ticket price is required'],
    min: [0, 'Price cannot be negative']
  },
  seats: {
    type: [seatSchema],
    required: [true, 'Seats configuration is required']
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

// Virtual populate for reservations
sessionSchema.virtual('reservations', {
  ref: 'Reservation',
  localField: '_id',
  foreignField: 'session',
  justOne: false
});

// Create index for efficient queries
sessionSchema.index({ movie: 1, theater: 1, datetime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
