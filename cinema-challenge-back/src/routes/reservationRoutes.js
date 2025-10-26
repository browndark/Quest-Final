const express = require('express');
const { 
  getReservations, 
  getMyReservations,
  getReservationById, 
  createReservation, 
  updateReservationStatus, 
  deleteReservation 
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing reservations. All endpoints require Bearer token authentication.
 */

// All routes below are protected
router.use(protect);

/**
 * @swagger
 * /reservations/me:
 *   get:
 *     summary: Get all reservations for the current user
 *     tags: [Reservations]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     responses:
 *       200:
 *         description: User's reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorized
 */
router.get('/me', getMyReservations);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *               - seats
 *             properties:
 *               session:
 *                 type: string
 *                 description: Session ID
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - row
 *                     - number
 *                     - type
 *                   properties:
 *                     row:
 *                       type: string
 *                       description: Seat row (e.g., A, B, C)
 *                     number:
 *                       type: integer
 *                       description: Seat number
 *                     type:
 *                       type: string
 *                       enum: [full, half]
 *                       description: Ticket type
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, pix, bank_transfer]
 *                 default: credit_card
 *                 description: Payment method
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input data or seats already taken
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Session not found
 */
router.post('/', createReservation);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations (admin only)
 *     tags: [Reservations]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of reservations to return
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 15
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     next:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                     prev:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authorize('admin'), getReservations);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Reservation not found
 *   put:
 *     summary: Update reservation status (admin only)
 *     tags: [Reservations]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: New reservation status
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *                 description: Payment status
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Reservation not found
 *   delete:
 *     summary: Delete a reservation (admin only)
 *     tags: [Reservations]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reservation deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Reservation not found
 */
router.route('/:id')
  .get(getReservationById)
  .put(authorize('admin'), updateReservationStatus)
  .delete(authorize('admin'), deleteReservation);

module.exports = router;
