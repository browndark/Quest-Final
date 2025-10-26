const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { Movie, Session, Theater } = require('../models');
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

// Função para gerar assentos baseado na capacidade do teatro
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

// Novos filmes para adicionar ao banco de dados
const additionalMovies = [
  {
    customId: '4',
    title: 'The Matrix',
    synopsis: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    director: 'Lana Wachowski, Lilly Wachowski',
    genres: ['Science Fiction', 'Action'],
    duration: 136,
    classification: 'R',
    poster: 'matrix.jpg',
    releaseDate: new Date('1999-03-31')
  },
  {
    customId: '5',
    title: 'Pulp Fiction',
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    director: 'Quentin Tarantino',
    genres: ['Crime', 'Drama'],
    duration: 154,
    classification: 'R',
    poster: 'pulpfiction.jpg',
    releaseDate: new Date('1994-10-14')
  },
  {
    customId: '6',
    title: 'The Dark Knight',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    genres: ['Action', 'Crime', 'Drama'],
    duration: 152,
    classification: 'PG-13',
    poster: 'darkknight.jpg',
    releaseDate: new Date('2008-07-18')
  },
  {
    customId: '7',
    title: 'Fight Club',
    synopsis: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    director: 'David Fincher',
    genres: ['Drama'],
    duration: 139,
    classification: 'R',
    poster: 'fightclub.jpg',
    releaseDate: new Date('1999-10-15')
  },
  {
    customId: '8',
    title: 'Forrest Gump',
    synopsis: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.',
    director: 'Robert Zemeckis',
    genres: ['Drama', 'Romance'],
    duration: 142,
    classification: 'PG-13',
    poster: 'forrestgump.jpg',
    releaseDate: new Date('1994-07-06')
  },
  {
    customId: '9',
    title: 'The Godfather',
    synopsis: 'An organized crime dynasty\'s aging patriarch transfers control of his clandestine empire to his reluctant son.',
    director: 'Francis Ford Coppola',
    genres: ['Crime', 'Drama'],
    duration: 175,
    classification: 'R',
    poster: 'godfather.jpg',
    releaseDate: new Date('1972-03-24')
  },
  {
    customId: '10',
    title: 'Interstellar',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    director: 'Christopher Nolan',
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    duration: 169,
    classification: 'PG-13',
    poster: 'interstellar.jpg',
    releaseDate: new Date('2014-11-07')
  },
  {
    customId: '11',
    title: 'Gladiator',
    synopsis: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    director: 'Ridley Scott',
    genres: ['Action', 'Adventure', 'Drama'],
    duration: 155,
    classification: 'R',
    poster: 'gladiator.jpg',
    releaseDate: new Date('2000-05-05')
  },
  {
    customId: '12',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    synopsis: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    director: 'Peter Jackson',
    genres: ['Adventure', 'Fantasy', 'Drama'],
    duration: 178,
    classification: 'PG-13',
    poster: 'lotr.jpg',
    releaseDate: new Date('2001-12-19')
  },
  {
    customId: '13',
    title: 'Titanic',
    synopsis: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    director: 'James Cameron',
    genres: ['Drama', 'Romance'],
    duration: 194,
    classification: 'PG-13',
    poster: 'titanic.jpg',
    releaseDate: new Date('1997-12-19')
  },
  {
    customId: '14',
    title: 'Avatar',
    synopsis: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    director: 'James Cameron',
    genres: ['Action', 'Adventure', 'Fantasy'],
    duration: 162,
    classification: 'PG-13',
    poster: 'avatar.jpg',
    releaseDate: new Date('2009-12-18')
  },
  {
    customId: '15',
    title: 'Jurassic Park',
    synopsis: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.',
    director: 'Steven Spielberg',
    genres: ['Adventure', 'Science Fiction'],
    duration: 127,
    classification: 'PG-13',
    poster: 'jurassicpark.jpg',
    releaseDate: new Date('1993-06-11')
  },
  {
    customId: '16',
    title: 'The Lion King',
    synopsis: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    director: 'Roger Allers, Rob Minkoff',
    genres: ['Animation', 'Adventure', 'Drama'],
    duration: 88,
    classification: 'G',
    poster: 'lionking.jpg',
    releaseDate: new Date('1994-06-24')
  }
];

// Função para adicionar novos filmes e sessões
const addMoreMovies = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    console.log('Conectado ao banco de dados. Iniciando adição de novos filmes...');
    
    // Adicionar novos filmes
    const createdMovies = await Movie.insertMany(additionalMovies);
    console.log(`${createdMovies.length} novos filmes adicionados com sucesso!`);
    
    // Buscar teatros existentes
    const theaters = await Theater.find();
    if (!theaters.length) {
      console.log('Nenhum teatro encontrado. Não é possível criar sessões.');
      process.exit(0);
    }
    
    // Criar sessões para os novos filmes
    const sessions = [];
    
    // Gerar sessões para os próximos 7 dias
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Para cada filme
      for (let movie of createdMovies) {
        // Para cada teatro
        for (let theater of theaters) {
          // Criar 2-3 sessões por dia
          const numSessions = Math.floor(Math.random() * 2) + 2; // 2-3 sessões
          
          for (let j = 0; j < numSessions; j++) {
            const hours = 12 + j * 4; // Sessões às 12h, 16h, 20h
            const sessionDate = new Date(date);
            sessionDate.setHours(hours, 0, 0, 0);
            
            sessions.push({
              movie: movie._id,
              theater: theater._id,
              datetime: sessionDate,
              fullPrice: 15.0 + Math.floor(Math.random() * 10), // Preço entre 15 e 25
              halfPrice: 7.5 + Math.floor(Math.random() * 5), // Metade do preço
              seats: generateSeats(theater.capacity)
            });
          }
        }
      }
    }
    
    const createdSessions = await Session.insertMany(sessions);
    console.log(`${createdSessions.length} novas sessões criadas com sucesso!`);
    
    console.log('Operação concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao adicionar filmes:', error);
    process.exit(1);
  }
};

// Executar função para adicionar filmes
addMoreMovies();
