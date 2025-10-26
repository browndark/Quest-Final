import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMoneyBillWave, FaQrcode, FaRegCheckCircle } from 'react-icons/fa';
import reservationsService from '../../api/reservations';
import useAlert from '../../hooks/useAlert';
import useAuth from '../../hooks/useAuth';
import './styles.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert, error } = useAlert();
  const { user } = useAuth();
  
  // Get reservation data from location state
  const { session, selectedSeats } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    // Redirect if no session or seats data
    if (!session || !selectedSeats || selectedSeats.length === 0) {
      error('Dados de reserva incompletos. Por favor, selecione assentos novamente.');
      navigate('/');
    }
  }, [session, selectedSeats, error, navigate]);

  // Calculate total price based on seat types and session prices
  const calculateTotal = () => {
    if (!session || !selectedSeats) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      // Default to full price if type not specified
      const price = seat.type === 'half' ? session.halfPrice : session.fullPrice;
      return total + price;
    }, 0);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  const handleCheckout = async () => {
    try {
      setProcessing(true);
      
      // Prepare seats with type info (default to full price)
      const seatsWithType = selectedSeats.map(seat => ({
        row: seat.row,
        number: seat.number,
        type: seat.type || 'full'
      }));
      
      // Create reservation
      const reservationData = {
        session: session._id,
        seats: seatsWithType,
        totalPrice: calculateTotal(),
        paymentMethod: paymentMethod
      };
      
      const response = await reservationsService.createReservation(reservationData);
      
      if (response.success) {
        setReservation(response.data);
        setCompleted(true);
        // Não mostrar alerta aqui, já temos a tela de confirmação
      } else {
        throw new Error(response.message || 'Erro ao processar reserva');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      error('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="checkout-container loading-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (completed && reservation) {
    return (
      <div className="checkout-container">
        <div className="checkout-confirmation">
          <div className="confirmation-header">
            <FaRegCheckCircle className="confirmation-icon" />
            <h1>Reserva Confirmada!</h1>
            <p>Sua reserva foi concluída com sucesso.</p>
          </div>
          
          <div className="confirmation-details">
            <h2>Detalhes da Reserva</h2>
            
            <div className="confirmation-info">
              <div className="info-item">
                <span className="info-label">Código da Reserva:</span>
                <span className="info-value">{reservation._id}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Filme:</span>
                <span className="info-value">{session.movie.title}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Data:</span>
                <span className="info-value">{formatDate(session.datetime)}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Horário:</span>
                <span className="info-value">{formatTime(session.datetime)}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Cinema:</span>
                <span className="info-value">{session.theater.name}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Assentos:</span>
                <span className="info-value">
                  {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </span>
              </div>
              
              <div className="info-item total">
                <span className="info-label">Total Pago:</span>
                <span className="info-value">R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
            <div className="confirmation-actions">
            <Link to="/reservations" className="btn btn-primary">
              Visualizar Minhas Reservas
            </Link>
            <Link to="/" className="btn btn-secondary">
              Voltar para Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <Link to={`/sessions/${session?._id}`} className="back-link">
          <FaArrowLeft /> Voltar para seleção de assentos
        </Link>
        <h1>Finalizar Compra</h1>
      </div>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Resumo do Pedido</h2>
          
          <div className="movie-info">
            {session?.movie?.poster && (
              <img 
                src={session.movie.poster} 
                alt={session.movie.title}
                className="movie-poster"
              />
            )}
            
            <div className="movie-details">
              <h3>{session?.movie?.title}</h3>
              <p><strong>Data:</strong> {formatDate(session?.datetime)}</p>
              <p><strong>Horário:</strong> {formatTime(session?.datetime)}</p>
              <p><strong>Cinema:</strong> {session?.theater?.name}</p>
            </div>
          </div>
          
          <div className="seats-info">
            <h3>Assentos</h3>
            <ul className="selected-seats-list">
              {selectedSeats?.map(seat => (
                <li key={`${seat.row}-${seat.number}`} className="seat-item">
                  Fileira {seat.row}, Assento {seat.number} 
                  <span className="seat-type">
                    {seat.type === 'half' ? 'Meia-entrada' : 'Inteira'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="price-summary">
            <div className="price-detail">
              <span>Total:</span>
              <span className="price">R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="payment-section">
          <h2>Método de Pagamento</h2>
          
          <div className="payment-methods">
            <div 
              className={`payment-method ${paymentMethod === 'credit_card' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('credit_card')}
            >
              <FaCreditCard className="payment-icon" />
              <span>Cartão de Crédito</span>
            </div>
            
            <div 
              className={`payment-method ${paymentMethod === 'debit_card' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('debit_card')}
            >
              <FaCreditCard className="payment-icon" />
              <span>Cartão de Débito</span>
            </div>
            
            <div 
              className={`payment-method ${paymentMethod === 'pix' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('pix')}
            >
              <FaQrcode className="payment-icon" />
              <span>PIX</span>
            </div>
            
            <div 
              className={`payment-method ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('bank_transfer')}
            >
              <FaMoneyBillWave className="payment-icon" />
              <span>Transferência Bancária</span>
            </div>
          </div>
          
          {/* Payment details would go here in a real implementation */}
          <div className="payment-note">
            <p>
              Esta é uma demonstração. Nenhum pagamento real será processado.
              Clique em "Finalizar Compra" para simular um pagamento bem-sucedido.
            </p>
          </div>
          
          <div className="checkout-actions">
            <button 
              className="btn btn-primary btn-checkout"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
