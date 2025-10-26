import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import moviesService from '../../api/movies';
import sessionsService from '../../api/sessions';
import useAlert from '../../hooks/useAlert';
import './styles.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const { error } = useAlert();
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        console.log(`Fetching movie details for ID: ${id}`);
        const response = await moviesService.getMovieById(id);
        console.log('Movie detail response:', response);
        
        if (response.success && response.data) {
          setMovie(response.data);
        } else {
          error('Erro ao carregar detalhes do filme.');
          console.error('Movie data not found in response:', response);
        }
      } catch (err) {
        error('Erro ao carregar informações. Tente novamente mais tarde.');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id, error]);
  
  useEffect(() => {
    // Fetch sessions for this movie
    const fetchSessions = async () => {
      if (!movie) return;
      
      try {
        setLoadingSessions(true);
        console.log(`Fetching sessions for movie ID: ${id}`);
        const response = await sessionsService.getSessions({ movie: id });
        console.log('Sessions response:', response);
        
        if (response.success && response.data) {
          // Group sessions by date
          setSessions(response.data);
        } else {
          console.error('Sessions not found in response:', response);
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoadingSessions(false);
      }
    };
    
    if (movie) {
      fetchSessions();
    }
  }, [movie, id]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('pt-BR', options);
  };
  
  // Group sessions by date
  const groupSessionsByDate = () => {
    const grouped = {};
    
    sessions.forEach(session => {
      const date = new Date(session.datetime).toLocaleDateString('pt-BR');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });
    
    return grouped;
  };
  
  if (loading) {
    return <div className="loading">Carregando detalhes do filme...</div>;
  }
  
  if (!movie) {
    return <div className="error-message">Filme não encontrado.</div>;
  }
  
  const groupedSessions = groupSessionsByDate();
  
  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <div className="movie-detail-header">
          <div className="movie-poster">
            <img 
              src={movie.poster.startsWith('http') ? movie.poster : `/assets/images/${movie.poster}`} 
              alt={`Poster do filme ${movie.title}`}
              onError={(e) => {
                e.target.src = '/assets/images/no-image.jpg';
              }}
            />
          </div>
          
          <div className="movie-info">
            <h1>{movie.title}</h1>
            
            <div className="movie-meta">
              <span className="classification">{movie.classification}</span>
              <span><FaClock /> {movie.duration} min</span>
              <span><FaCalendarAlt /> {formatDate(movie.releaseDate)}</span>
            </div>
            
            <div className="movie-genres">
              {movie.genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="movie-director">
              <strong>Diretor:</strong> {movie.director}
            </div>
            
            <div className="movie-synopsis">
              <h2>Sinopse</h2>
              <p>{movie.synopsis}</p>
            </div>
            
            <div className="sessions-container">
              <h2>Sessões Disponíveis</h2>
              
              {loadingSessions ? (
                <p>Carregando sessões...</p>
              ) : sessions.length === 0 ? (
                <p className="no-sessions">Não há sessões disponíveis para este filme.</p>
              ) : (
                <div className="sessions-list">
                  {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                    <div key={date} className="session-date-group">
                      <h3 className="session-date">{date}</h3>
                      <div className="session-times">
                        {dateSessions.map(session => (
                          <div key={session._id} className="session-card">
                            <div className="session-info">
                              <div className="session-time">
                                <FaClock /> {formatTime(session.datetime)}
                              </div>
                              <div className="session-theater">
                                <FaMapMarkerAlt /> {session.theater.name} - {session.theater.type}
                              </div>
                              <div className="session-price">
                                <FaTicketAlt /> Inteira: R$ {session.fullPrice.toFixed(2)} | Meia: R$ {session.halfPrice.toFixed(2)}
                              </div>
                            </div>
                            <Link 
                              to={`/sessions/${session._id}`} 
                              className="btn btn-primary session-button"
                            >
                              Selecionar Assentos
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/" className="btn btn-primary back-button">
              Voltar para Filmes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
