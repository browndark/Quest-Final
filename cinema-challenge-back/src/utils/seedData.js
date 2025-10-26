const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { User, Movie, Theater, Session } = require('../models');
const connectDB = require('../config/db');

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Verificar se a variável de ambiente foi carregada
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente!');
  console.error('   Verifique se o arquivo .env existe na raiz do projeto.');
  console.error('   Caminho procurado:', path.join(__dirname, '../../.env'));
  process.exit(1);
}

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

const movies = [
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
    releaseDate: new Date('1994-10-14')
  }
];

const theaters = [
  {
    name: 'Theater 1',
    capacity: 120,
    type: 'standard'
  },
  {
    name: 'Theater 2',
    capacity: 80,
    type: '3D'
  },
  {
    name: 'Theater 3',
    capacity: 60,
    type: 'IMAX'
  }
];

// Function to generate seats based on theater capacity
const generateSeats = (capacity) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = Math.ceil(capacity / rows.length);
  
  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      if (seats.length < capacity) {
        seats.push({
          row: rows[i],
          number: j,
          status: 'available'
        });
      }
    }
  }
  
  return seats;
};

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Session.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Create movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`${createdMovies.length} movies created`);
    
    // Create theaters
    const createdTheaters = await Theater.insertMany(theaters);
    console.log(`${createdTheaters.length} theaters created`);
    
    // Create sessions
    const sessions = [];
    
    // Generate sessions for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // For each movie
      for (let movie of createdMovies) {
        // For each theater
        for (let theater of createdTheaters) {
          // Create 2-3 sessions per day
          const numSessions = Math.floor(Math.random() * 2) + 2; // 2-3 sessions
          
          for (let j = 0; j < numSessions; j++) {
            const hours = 12 + j * 4; // Sessions at 12pm, 4pm, 8pm
            const sessionDate = new Date(date);
            sessionDate.setHours(hours, 0, 0, 0);
            
            sessions.push({
              movie: movie._id,
              theater: theater._id,
              datetime: sessionDate,
              fullPrice: 15.0,
              halfPrice: 7.5,
              seats: generateSeats(theater.capacity)
            });
          }
        }
      }
    }
    
    const createdSessions = await Session.insertMany(sessions);
    console.log(`${createdSessions.length} sessions created`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
