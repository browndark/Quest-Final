const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - synopsis
 *         - director
 *         - genres
 *         - duration
 *         - classification
 *         - releaseDate
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         customId:
 *           type: string
 *           description: Custom identifier for the movie (optional)
 *         title:
 *           type: string
 *           description: The title of the movie
 *         synopsis:
 *           type: string
 *           description: A brief summary of the movie's plot
 *         director:
 *           type: string
 *           description: The movie's director
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: List of genres for the movie
 *         duration:
 *           type: number
 *           description: Duration of the movie in minutes
 *         classification:
 *           type: string
 *           description: Age classification (e.g., G, PG, PG-13, R)
 *         poster:
 *           type: string
 *           description: URL to the movie's poster image
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: The movie's release date
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the movie was added to the system
 *       example:
 *         _id: 60d0fe4f5311236168a109cb
 *         title: The Shawshank Redemption
 *         synopsis: Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.
 *         director: Frank Darabont
 *         genres: [Drama]
 *         duration: 142
 *         classification: R
 *         poster: shawshank.jpg
 *         releaseDate: 1994-09-23T00:00:00.000Z
 *         createdAt: 2021-06-21T12:00:00.000Z
 */

const movieSchema = new mongoose.Schema({
  customId: {
    type: String,
    index: true,  // Add index for faster lookups
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  synopsis: {
    type: String,
    required: [true, 'Synopsis is required']
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true
  },
  genres: {
    type: [String],
    required: [true, 'At least one genre is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required']
  },
  classification: {
    type: String,
    required: [true, 'Age classification is required'],
    trim: true
  },
  poster: {
    type: String,
    default: 'no-image.jpg'
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
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
movieSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'movie',
  justOne: false
});

module.exports = mongoose.model('Movie', movieSchema);
