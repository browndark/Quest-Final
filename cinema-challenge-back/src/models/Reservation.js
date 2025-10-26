const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SelectedSeat:
 *       type: object
 *       required:
 *         - row
 *         - number
 *         - type
 *       properties:
 *         row:
 *           type: string
 *           description: Row identifier (e.g., A, B, C)
 *         number:
 *           type: number
 *           description: Seat number in the row
 *         type:
 *           type: string
 *           enum: [full, half]
 *           description: Ticket type (full price or half price)
 *       example:
 *         row: "C"
 *         number: 5
 *         type: "full"
 *
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - session
 *         - seats
 *         - totalPrice
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the reservation
 *         user:
 *           type: string
 *           description: Reference to the user who made the reservation (User ID)
 *         session:
 *           type: string
 *           description: Reference to the movie session (Session ID)
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SelectedSeat'
 *           description: Array of selected seats
 *         totalPrice:
 *           type: number
 *           description: Total price of the reservation
 *           minimum: 0
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *           default: pending
 *           description: Current status of the reservation
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed]
 *           default: pending
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, debit_card, pix, bank_transfer]
 *           default: credit_card
 *           description: Payment method used
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Date when payment was completed (if applicable)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the reservation was created
 *       example:
 *         _id: 60d0fe4f5311236168a109ce
 *         user: "60d0fe4f5311236168a109ca"
 *         session: "60d0fe4f5311236168a109cd"
 *         seats: [
 *           { row: "C", number: 5, type: "full" },
 *           { row: "C", number: 6, type: "half" }
 *         ]
 *         totalPrice: 30
 *         status: "confirmed"
 *         paymentStatus: "completed"
 *         paymentMethod: "credit_card"
 *         paymentDate: "2021-06-21T12:30:00.000Z"
 *         createdAt: "2021-06-21T12:00:00.000Z"
 */

// Selected seat schema
const selectedSeatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['full', 'half'],
    required: true
  }
}, { _id: false });

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: [true, 'Session is required']
  },
  seats: {
    type: [selectedSeatSchema],
    required: [true, 'At least one seat must be selected'],
    validate: {
      validator: function(seats) {
        return seats.length > 0;
      },
      message: 'At least one seat must be selected'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Price cannot be negative']
  },  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'pix', 'bank_transfer'],
    default: 'credit_card'
  },
  paymentDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for efficient queries
reservationSchema.index({ user: 1, session: 1 });
reservationSchema.index({ session: 1, status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
