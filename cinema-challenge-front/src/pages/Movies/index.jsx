import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/movies/MovieCard';
import moviesService from '../../api/movies';
import useAlert from '../../hooks/useAlert';
import { FaSpinner, FaFilter } from 'react-icons/fa';
import './styles.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    search: ''
  });
  const { error } = useAlert();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Request more movies for a comprehensive page (up to 20)
        const response = await moviesService.getMovies({ limit: 20 });
        
        if (response && response.success && response.data && response.data.length > 0) {
          setMovies(response.data);
        } else {
          error('Não foi possível carregar os filmes.');
        }
      } catch (err) {
        error('Ocorreu um erro. Tente novamente mais tarde.');
        console.error('Erro ao buscar filmes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [error]);

  // Filter movies by genre and search term
  const filteredMovies = movies.filter(movie => {
    const matchesGenre = !filters.genre || 
      (movie.genres && movie.genres.some(g => g.toLowerCase().includes(filters.genre.toLowerCase())));
    
    const matchesSearch = !filters.search || 
      (movie.title && movie.title.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchesGenre && matchesSearch;
  });

  // Get all unique genres from movies
  const allGenres = [...new Set(movies.flatMap(movie => movie.genres || []))];

  return (
    <div className="movies-container">
      <h1>Filmes em Cartaz</h1>
      
      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <div className="genre-filter">
          <FaFilter className="filter-icon" />
          <select
            value={filters.genre}
            onChange={(e) => setFilters({...filters, genre: e.target.value})}
          >
            <option value="">Todos os gêneros</option>
            {allGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Carregando filmes...</p>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>Nenhum filme encontrado para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Movies;
