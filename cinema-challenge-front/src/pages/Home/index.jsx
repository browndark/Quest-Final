import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { runApiDiagnostics } from '../../utils/apiDiagnostics';
import MovieCard from '../../components/movies/MovieCard';
import moviesService from '../../api/movies';
import useAlert from '../../hooks/useAlert';
import { FaSpinner } from 'react-icons/fa';
import './styles.css';

const Home = () => {
  // Estado para armazenar os filmes vindos da API
  const [currentMovies, setCurrentMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useAlert();
  
  // Sample movie data que será mostrado caso ocorra algum problema com a API
  const [featuredMovies] = useState([
    {
      id: 1,
      title: "Inception",
      genre: ["Science Fiction", "Action"],
      description: "A thief who enters the dreams of others to steal their secrets.",
      poster: "no-image.jpg",
      genres: ["Science Fiction", "Action"],
      duration: 148,
      classification: "PG-13",
      releaseDate: "2010-07-16",
      synopsis: "A thief who enters the dreams of others to steal their secrets."
    },
    {
      id: 2,
      title: "The Avengers",
      genre: ["Action", "Adventure"],
      description: "Earth's mightiest heroes must come together to save the world.",
      poster: "no-image.jpg",
      genres: ["Action", "Adventure"],
      duration: 143,
      classification: "PG-13",
      releaseDate: "2012-05-04",
      synopsis: "Earth's mightiest heroes must come together to save the world."
    },
    {
      id: 3,
      title: "The Shawshank Redemption",
      genre: ["Drama"],
      description: "Two imprisoned men bond over a number of years.",
      poster: "no-image.jpg",
      genres: ["Drama"],
      duration: 142,
      classification: "R",
      releaseDate: "1994-09-23",
      synopsis: "Two imprisoned men bond over a number of years."    }
  ]);
  
  // Buscar filmes da API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await moviesService.getMovies({ limit: 12 }); // Aumentando para 12 filmes
        
        if (response && response.success && response.data && response.data.length > 0) {
          console.log('Filmes carregados da API:', response.data);
          setCurrentMovies(response.data);
        } else {
          console.log('Sem dados de filmes da API, usando dados locais');
        }
      } catch (err) {
        error('Não foi possível carregar os filmes. Usando dados locais.');
        console.error('Erro ao buscar filmes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    
    // Run API diagnostics para ajudar com debugging
    runApiDiagnostics().then(() => {
      console.log('API diagnostics completed. Check console for results.');
    });
  }, [error]);

  return (
    <div className="home-container">
      <h1>Welcome to Cinema App</h1>
      <p>Your premier destination for movie tickets and information</p>
        <div className="features-section">
        <h2>Available Features</h2>
        <ul>
          <li>Browse latest movie releases</li>
          <li>View movie details and trailers</li>
          <li>Select showtimes and seats</li>
          <li>Purchase tickets online</li>
          <li>Manage your reservations</li>
        </ul>
        <div className="cta-buttons">
          <Link to="/movies" className="btn btn-primary btn-lg">Ver todos os filmes em cartaz</Link>
        </div>
      </div>
      
      <div className="featured-movies">
        <h2>Filmes em Cartaz</h2>
        
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Carregando filmes...</p>
          </div>
        ) : currentMovies && currentMovies.length > 0 ? (
          <div className="movie-grid">
            {currentMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="movie-grid">
            {featuredMovies.map(movie => (
              <div className="movie-card" key={movie.id}>
                <h3>{movie.title}</h3>
                <p className="movie-genres">{movie.genre.join(", ")}</p>
                <p className="movie-description">{movie.description}</p>
                <Link to={`/movies/${movie.id}`} className="btn-primary">View Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>Stay tuned for more exciting movies and features!</p>
      </div>
    </div>
  );
};

export default Home;
