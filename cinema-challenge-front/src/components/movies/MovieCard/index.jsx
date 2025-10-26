import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaRegCalendarAlt } from 'react-icons/fa';
import './styles.css';

const MovieCard = ({ movie }) => {
  // Format release date
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback to the original string
    }
  };

  // Verificar se o filme existe
  if (!movie) {
    return (
      <div className="movie-card movie-card-error">
        <p>Dados do filme não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">        <img 
          src={movie.poster && movie.poster.startsWith('http') 
            ? movie.poster 
            : `/assets/images/${movie.poster || 'no-image.svg'}`} 
          alt={`Poster do filme ${movie.title}`}
          onError={(e) => {
            e.target.src = '/assets/images/no-image.svg';
            // Fallback para evitar loop infinito se a imagem de fallback também falhar
            e.target.onerror = null;
          }}
        />
        <div className="movie-classification">
          {movie.classification || 'N/A'}
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <span className="movie-duration">
            <FaClock /> {movie.duration || 'N/A'} min
          </span>
          <span className="movie-release">
            <FaRegCalendarAlt /> {formatDate(movie.releaseDate)}
          </span>
        </div>
        
        <div className="movie-genres">
          {movie.genres && movie.genres.length > 0 ? (
            movie.genres.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))
          ) : (
            <span className="genre-tag">Sem gênero definido</span>
          )}
        </div>
        
        <p className="movie-synopsis">
          {movie.synopsis ? (
            movie.synopsis.length > 100 
              ? `${movie.synopsis.substring(0, 100)}...` 
              : movie.synopsis
          ) : (
            'Sinopse não disponível'
          )}
        </p>
        
        <Link to={`/movies/${movie._id || movie.id}`} className="btn btn-primary">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
