/**
 * Seed Session Data Script
 * 
 * This script creates example sessions for movies in the database
 */
const mongoose = require('mongoose');
const { Movie, Theater, Session } = require('../models');
require('dotenv').config({ path: '../../.env' });

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding sessions...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Helper function to generate theater seats
const generateTheaterSeats = (rows, seatsPerRow) => {
  const seats = [];
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < rows; i++) {
    const row = rowLetters[i];
    for (let j = 1; j <= seatsPerRow; j++) {
      seats.push({
        row,
        number: j,
        status: 'available'
      });
    }
  }
  
  return seats;
};

// Create random status for some seats
const createRandomSeatStatuses = (seats, reservedPercentage, occupiedPercentage) => {
  const seatsCopy = [...seats];
  const totalSeats = seatsCopy.length;
  const reservedCount = Math.floor(totalSeats * reservedPercentage);
  const occupiedCount = Math.floor(totalSeats * occupiedPercentage);
  
  // Set some seats as reserved
  for (let i = 0; i < reservedCount; i++) {
    const randomIndex = Math.floor(Math.random() * seatsCopy.length);
    if (seatsCopy[randomIndex].status === 'available') {
      seatsCopy[randomIndex].status = 'reserved';
    }
  }
  
  // Set some seats as occupied
  for (let i = 0; i < occupiedCount; i++) {
    const randomIndex = Math.floor(Math.random() * seatsCopy.length);
    if (seatsCopy[randomIndex].status === 'available') {
      seatsCopy[randomIndex].status = 'occupied';
    }
  }
  
  return seatsCopy;
};

// Seed sessions data
const seedSessions = async () => {
  try {
    // Clean existing sessions
    await Session.deleteMany();
    console.log('Existing sessions deleted');
    
    // Get all movies
    const movies = await Movie.find();
    if (movies.length === 0) {
      console.error('No movies found in database. Please run seed script for movies first.');
      process.exit(1);
    }
    
    // Get all theaters
    const theaters = await Theater.find();
    if (theaters.length === 0) {
      console.log('No theaters found. Creating example theaters...');
      
      // Create example theaters
      const theaterData = [
        { 
          name: 'Sala 1',
          type: 'Standard',
          capacity: 80,
          features: ['2D', 'Comfortable Seats']
        },
        { 
          name: 'Sala 2',
          type: 'VIP',
          capacity: 50,
          features: ['2D', '3D', 'Reclining Seats', 'Food Service']
        },
        { 
          name: 'Sala 3',
          type: 'IMAX',
          capacity: 120,
          features: ['2D', '3D', 'IMAX', 'Dolby Atmos']
        }
      ];
      
      const createdTheaters = await Theater.create(theaterData);
      console.log(`${createdTheaters.length} theaters created`);
      
      // Use created theaters
      const newTheaters = await Theater.find();
      await createSessions(movies, newTheaters);
    } else {
      await createSessions(movies, theaters);
    }
    
    console.log('Sessions seeding completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding sessions:', error);
    process.exit(1);
  }
};

// Function to create sessions
const createSessions = async (movies, theaters) => {
  // Session times
  const sessionTimes = ['10:00', '13:00', '16:00', '19:00', '22:00'];
  
  // Date range - create sessions for the next 7 days
  const sessionsToCreate = [];
  
  // For each movie
  for (const movie of movies) {
    // Randomly select 1-3 theaters for this movie
    const movieTheaters = theaters.slice(0, Math.floor(Math.random() * theaters.length) + 1);
    
    // For each theater
    for (const theater of movieTheaters) {
      // Generate base seats configuration
      const baseSeats = generateTheaterSeats(8, 10); // 8 rows, 10 seats per row
      
      // For the next 7 days
      for (let day = 0; day < 7; day++) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + day);
        
        // Randomly select 1-3 times for sessions on this day
        const numTimes = Math.floor(Math.random() * 3) + 1;
        const selectedTimes = sessionTimes
          .sort(() => 0.5 - Math.random())
          .slice(0, numTimes);
        
        // For each selected time
        for (const time of selectedTimes) {
          const [hours, minutes] = time.split(':');
          
          const sessionDateTime = new Date(sessionDate);
          sessionDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          
          // Create random seat statuses (more occupied seats for earlier dates)
          const dayFactor = day / 10; // 0 to 0.7
          const randomizedSeats = createRandomSeatStatuses(
            baseSeats,
            dayFactor, // reserved percentage increases with day
            0.1 + dayFactor // occupied percentage increases with day
          );
          
          // Create session object
          sessionsToCreate.push({
            movie: movie._id,
            theater: theater._id,
            datetime: sessionDateTime,
            fullPrice: 20 + (theater.type === 'VIP' ? 10 : 0) + (theater.type === 'IMAX' ? 15 : 0),
            halfPrice: 10 + (theater.type === 'VIP' ? 5 : 0) + (theater.type === 'IMAX' ? 7.5 : 0),
            seats: randomizedSeats
          });
        }
      }
    }
  }
  
  // Insert all sessions
  const result = await Session.insertMany(sessionsToCreate);
  console.log(`${result.length} sessions created`);
};

// Run seeder
seedSessions().catch(err => {
  console.error('Error during session seeding:', err);
  process.exit(1);
});
