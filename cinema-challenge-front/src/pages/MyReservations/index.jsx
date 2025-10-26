import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import reservationsService from '../../api/reservations';
import useAlert from '../../hooks/useAlert';
import useAuth from '../../hooks/useAuth';
import './styles.css';

const MyReservations = () => {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const response = await reservationsService.getMyReservations();
        
        if (response.success && response.data) {
          setReservations(response.data);
        } else {
          showAlert('Erro ao carregar reservas', 'error');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        showAlert('Erro ao carregar reservas', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [isAuthenticated, showAlert]);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('pt-BR', options);
  };

  return (
    <div className="reservations-page">
      <div className="reservations-container">
        <div className="reservations-header">
          <h1>Minhas Reservas</h1>
        </div>

        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Carregando suas reservas...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-reservations">
            <FaTicketAlt className="empty-icon" />
            <h3>Nenhuma reserva encontrada</h3>
            <p>Você ainda não possui reservas. Explore nossos filmes em cartaz e faça sua primeira reserva!</p>
            <Link to="/movies" className="btn btn-primary">Ver filmes em cartaz</Link>
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header">
                  <h3>Reserva #{reservation._id.substring(0, 8)}</h3>
                  <span className={`status-badge ${reservation.status}`}>
                    {reservation.status === 'confirmed' ? 'Confirmada' : 
                     reservation.status === 'pending' ? 'Pendente' : 
                     reservation.status === 'canceled' ? 'Cancelada' : 
                     'Desconhecido'}
                  </span>
                </div>

                <div className="movie-info">
                  {reservation.session?.movie?.poster && (
                    <img 
                      src={reservation.session.movie.poster} 
                      alt={`Poster do filme ${reservation.session.movie.title}`}
                      className="movie-poster"
                    />
                  )}
                  
                  <div className="reservation-details">
                    <h4>{reservation.session?.movie?.title}</h4>
                    
                    <div className="detail-item">
                      <FaCalendarAlt />
                      <span>{formatDate(reservation.session?.datetime)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <FaClock />
                      <span>{formatTime(reservation.session?.datetime)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>{reservation.session?.theater?.name}</span>
                    </div>
                    
                    <div className="detail-item">
                      <FaTicketAlt />
                      <span>
                        {reservation.seats?.map(seat => `${seat.row}${seat.number}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="reservation-footer">
                  <div className="price-info">
                    <span>Total:</span>
                    <span className="price">R$ {reservation.totalPrice?.toFixed(2)}</span>
                  </div>
                  
                  {reservation.status === 'confirmed' && (
                    <div className="payment-info">
                      <span>Pago com:</span>
                      <span>{reservation.paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                            reservation.paymentMethod === 'debit_card' ? 'Cartão de Débito' :
                            reservation.paymentMethod === 'pix' ? 'PIX' :
                            reservation.paymentMethod === 'bank_transfer' ? 'Transferência Bancária' :
                            'Não informado'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="page-actions">
          <Link to="/" className="btn btn-secondary">
            Voltar para a Página Inicial
          </Link>
          <Link to="/movies" className="btn btn-primary">
            Ver Filmes em Cartaz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
