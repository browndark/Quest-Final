const express = require('express');
const { User } = require('../models');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Setup
 *   description: Development setup endpoints (only works in development environment). No authentication required.
 */

/**
 * @swagger
 * /setup/admin:
 *   post:
 *     summary: Create admin user (development only)
 *     tags: [Setup]
 *     description: Creates an admin user. Only works in development environment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin user's full name
 *                 example: "Admin User"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin user's email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin user's password (min 6 characters)
 *                 example: "admin123"
 *     responses:
 *       201:
 *         description: Admin user created successfully
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
 *                   example: "Admin user created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: Invalid input data or user already exists
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
 *                   example: "User with this email already exists"
 *       403:
 *         description: Not available in production
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
 *                   example: "Setup routes are only available in development environment"
 */
router.post('/admin', async (req, res, next) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Setup routes are only available in development environment'
      });
    }

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /setup/test-users:
 *   post:
 *     summary: Create default test users (development only)
 *     tags: [Setup]
 *     description: Creates default test users (one regular user and one admin). Only works in development environment.
 *     responses:
 *       201:
 *         description: Test users created successfully
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
 *                   example: "Test users created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                           password:
 *                             type: string
 *                           role:
 *                             type: string
 *       200:
 *         description: Test users already exist
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
 *                   example: "Test users already exist"
 *       403:
 *         description: Not available in production
 */
router.post('/test-users', async (req, res, next) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Setup routes are only available in development environment'
      });
    }

    const testUsers = [
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      }
    ];

    const createdUsers = [];
    const existingUsers = [];

    for (const userData of testUsers) {
      const userExists = await User.findOne({ email: userData.email });
      
      if (!userExists) {
        const user = await User.create(userData);
        createdUsers.push({
          email: userData.email,
          password: userData.password,
          role: userData.role,
          name: userData.name
        });
      } else {
        existingUsers.push({
          email: userData.email,
          role: userData.role
        });
      }
    }

    if (createdUsers.length > 0) {
      res.status(201).json({
        success: true,
        message: `Created ${createdUsers.length} test user(s)`,
        data: {
          created: createdUsers,
          existing: existingUsers
        }
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'All test users already exist',
        data: {
          existing: existingUsers
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
