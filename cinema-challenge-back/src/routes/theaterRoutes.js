const express = require('express');
const { 
  getTheaters, 
  getTheaterById, 
  createTheater, 
  updateTheater, 
  deleteTheater 
} = require('../controllers/theaterController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Theaters
 *   description: API for managing theaters. Public endpoints for viewing theaters, admin endpoints require Bearer token.
 */

/**
 * @swagger
 * /theaters:
 *   get:
 *     summary: Get all theaters
 *     tags: [Theaters]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [standard, 3D, IMAX, VIP]
 *         description: Filter by theater type
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., name, capacity)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of theaters to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of theaters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Theater'
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
 *                       example: 1
 */
router.get('/', getTheaters);

/**
 * @swagger
 * /theaters/{id}:
 *   get:
 *     summary: Get a theater by ID
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theater ID
 *     responses:
 *       200:
 *         description: Theater details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theater'
 *       404:
 *         description: Theater not found
 */
router.get('/:id', getTheaterById);

/**
 * @swagger
 * /theaters:
 *   post:
 *     summary: Create a new theater
 *     tags: [Theaters]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Theater name (must be unique)
 *               capacity:
 *                 type: number
 *                 description: Seating capacity
 *                 minimum: 1
 *               type:
 *                 type: string
 *                 enum: [standard, 3D, IMAX, VIP]
 *                 description: Theater type
 *     responses:
 *       201:
 *         description: Theater created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theater'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Theater with that name already exists
 */
router.post('/', protect, authorize('admin'), createTheater);

/**
 * @swagger
 * /theaters/{id}:
 *   put:
 *     summary: Update a theater
 *     tags: [Theaters]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theater ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Theater name
 *               capacity:
 *                 type: number
 *                 description: Seating capacity
 *                 minimum: 1
 *               type:
 *                 type: string
 *                 enum: [standard, 3D, IMAX, VIP]
 *                 description: Theater type
 *     responses:
 *       200:
 *         description: Theater updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theater'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Theater not found
 *       409:
 *         description: Theater name already in use
 */
router.put('/:id', protect, authorize('admin'), updateTheater);

/**
 * @swagger
 * /theaters/{id}:
 *   delete:
 *     summary: Delete a theater
 *     tags: [Theaters]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theater ID
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Theater not found
 *       409:
 *         description: Cannot delete theater with active sessions
 */
router.delete('/:id', protect, authorize('admin'), deleteTheater);

module.exports = router;
