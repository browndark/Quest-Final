const express = require('express');
const { 
  getMovies, 
  getMovieById, 
  createMovie, 
  updateMovie, 
  deleteMovie 
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API for managing movies. Public endpoints for viewing movies, admin endpoints require Bearer token.
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Movie title filter
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., releaseDate, title)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of movies to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 count:
 *                   type: integer
 *                   example: 20
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
 */
router.get('/', getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Movie not found"
 *       400:
 *         description: Invalid movie ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid movie ID format or movie not found"
 *                 error:
 *                   type: string
 */
router.get('/:id', getMovieById);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - synopsis
 *               - director
 *               - genres
 *               - duration
 *               - classification
 *               - releaseDate
 *             properties:
 *               title:
 *                 type: string
 *               synopsis:
 *                 type: string
 *               director:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *               classification:
 *                 type: string
 *               poster:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', protect, authorize('admin'), createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               synopsis:
 *                 type: string
 *               director:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *               classification:
 *                 type: string
 *               poster:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Movie not found
 */
router.put('/:id', protect, authorize('admin'), updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
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
 *                   example: "Movie removed"
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Movie not found
 */
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;
