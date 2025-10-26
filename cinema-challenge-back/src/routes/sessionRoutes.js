const express = require('express');
const { 
  getSessions, 
  getSessionById, 
  createSession, 
  updateSession, 
  deleteSession,
  resetSessionSeats
} = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: API for managing movie sessions. Public endpoints for viewing sessions, admin endpoints require Bearer token.
 */

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all movie sessions
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: movie
 *         schema:
 *           type: string
 *         description: Filter by movie ID
 *       - in: query
 *         name: theater
 *         schema:
 *           type: string
 *         description: Filter by theater ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of sessions to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of movie sessions
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
 *                   example: 5
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
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
 *                     $ref: '#/components/schemas/Session'
 */
router.get('/', getSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session details with populated movie and theater
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       404:
 *         description: Session not found
 */
router.get('/:id', getSessionById);

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie
 *               - theater
 *               - datetime
 *               - fullPrice
 *               - halfPrice
 *             properties:
 *               movie:
 *                 type: string
 *                 description: Movie ID
 *               theater:
 *                 type: string
 *                 description: Theater ID
 *               datetime:
 *                 type: string
 *                 format: date-time
 *                 description: Session date and time
 *               fullPrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Full ticket price
 *               halfPrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Half ticket price
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Movie or Theater not found
 *       409:
 *         description: Session conflict (time overlap)
 */
router.post('/', protect, authorize('admin'), createSession);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Update a session
 *     tags: [Sessions]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie:
 *                 type: string
 *                 description: Movie ID
 *               theater:
 *                 type: string
 *                 description: Theater ID
 *               datetime:
 *                 type: string
 *                 format: date-time
 *                 description: Session date and time
 *               fullPrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Full ticket price
 *               halfPrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Half ticket price
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Session not found
 *       409:
 *         description: Session has reservations, cannot update
 */
router.put('/:id', protect, authorize('admin'), updateSession);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     tags: [Sessions]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session deleted successfully
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
 *                   example: Session deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Session not found
 *       409:
 *         description: Cannot delete session with confirmed reservations
 */
router.delete('/:id', protect, authorize('admin'), deleteSession);

/**
 * @swagger
 * /sessions/{id}/reset-seats:
 *   put:
 *     summary: Reset all seats in a session to available status
 *     tags: [Sessions]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Seats reset successfully
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
 *                   example: All seats reset to available
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Session not found
 */
router.put('/:id/reset-seats', protect, authorize('admin'), resetSessionSeats);

module.exports = router;
