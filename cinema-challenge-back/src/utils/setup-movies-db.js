// Run this script to set up your database with proper movie data
// that matches the frontend hardcoded IDs

const connectDB = require('../config/db');
const { Movie } = require('../models');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Verificar se a variável de ambiente foi carregada
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente!');
  console.error('   Verifique se o arquivo .env existe na raiz do projeto.');
  console.error('   Caminho procurado:', path.join(__dirname, '../../.env'));
  process.exit(1);
}

// Sample movie data matching frontend IDs
const sampleMovies = [
  {
    customId: '1',
    title: 'Inception',
    synopsis: 'A thief who enters the dreams of others to steal their secrets.',
    director: 'Christopher Nolan',
    genres: ['Science Fiction', 'Action'],
    duration: 148,
    classification: 'PG-13',
    poster: 'inception.jpg',
    releaseDate: new Date('2010-07-16')
  },
  {
    customId: '2',
    title: 'The Avengers',
    synopsis: "Earth's mightiest heroes must come together to save the world.",
    director: 'Joss Whedon',
    genres: ['Action', 'Adventure'],
    duration: 143,
    classification: 'PG-13',
    poster: 'avengers.jpg',
    releaseDate: new Date('2012-05-04')
  },
  {
    customId: '3',
    title: 'The Shawshank Redemption',
    synopsis: 'Two imprisoned men bond over a number of years.',
    director: 'Frank Darabont',
    genres: ['Drama'],
    duration: 142,
    classification: 'R',
    poster: 'shawshank.jpg',
    releaseDate: new Date('1994-09-23')
  }
];

async function seedMovies() {
  try {
    // Connect to database
    await connectDB();
    
    console.log('Connected to database');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');
    
    // Insert new movies with customId matching frontend IDs
    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`Created ${createdMovies.length} movies with customId fields`);
    
    // Print created movies for verification
    console.log('Created movies:');
    createdMovies.forEach(movie => {
      console.log(`- ${movie.title} (customId: ${movie.customId}, _id: ${movie._id})`);
    });
    
    console.log('Database setup complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedMovies();
