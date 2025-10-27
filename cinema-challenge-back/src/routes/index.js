const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const theaterRoutes = require('./theaterRoutes');
const sessionRoutes = require('./sessionRoutes');
const reservationRoutes = require('./reservationRoutes');
const setupRoutes = require('./setupRoutes');

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-01T00:00:00.000Z"
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: API information and available endpoints
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
 *                   example: "Cinema App API v1"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: string
 *                       example: "/auth"
 *                     users:
 *                       type: string
 *                       example: "/users"
 *                     movies:
 *                       type: string
 *                       example: "/movies"
 *                     theaters:
 *                       type: string
 *                       example: "/theaters"
 *                     sessions:
 *                       type: string
 *                       example: "/sessions"
 *                     reservations:
 *                       type: string
 *                       example: "/reservations"
 *                 documentation:
 *                   type: string
 *                   example: "/docs"
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cinema App API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      users: '/users',
      movies: '/movies',
      theaters: '/theaters',
      sessions: '/sessions',
      reservations: '/reservations',
      setup: '/setup (development only)',
      health: '/health'
    },
    documentation: '/docs'
  });
});

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/theaters', theaterRoutes);
router.use('/sessions', sessionRoutes);
router.use('/reservations', reservationRoutes);
router.use('/setup', setupRoutes);

module.exports = router;
