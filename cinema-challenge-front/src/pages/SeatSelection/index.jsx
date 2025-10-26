import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaTicketAlt, FaCouch, FaCalendarAlt, FaSync } from 'react-icons/fa';
import sessionsService from '../../api/sessions';
import useAlert from '../../hooks/useAlert';
import useAuth from '../../hooks/useAuth';
import './styles.css';

const SeatSelection = () => {
  const { id } = useParams(); // session id
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { showAlert, error } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        console.log(`Fetching session details for ID: ${id}`);
        const response = await sessionsService.getSessionById(id);
        console.log('Session detail response:', response);

        if (response.success && response.data) {
          // Ensure session data has the required properties
          let sessionData = response.data;
          
          // Check if movie exists
          if (!sessionData.movie) {
            throw new Error('Movie data is missing in session response');
          }
          
          // Check if theater exists
          if (!sessionData.theater) {
            throw new Error('Theater data is missing in session response');
          }
            // Ensure seats array exists
          if (!Array.isArray(sessionData.seats)) {
            sessionData.seats = [];
            console.warn('Session seats property is not an array, using empty array');
          } else {
            console.log(`Carregados ${sessionData.seats.length} assentos para a sessão:`, 
              sessionData.seats.reduce((acc, seat) => {
                acc[seat.status] = (acc[seat.status] || 0) + 1;
                return acc;
              }, {})
            );
          }
          
          setSession(sessionData);
        } else {
          error('Erro ao carregar detalhes da sessão.');
          console.error('Session data not found in response:', response);
          // Navigate back to homepage if no valid data
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        error('Erro ao carregar informações. Tente novamente mais tarde.');
        console.error('Error fetching session details:', err);
        // Navigate back to homepage on error
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, error, navigate]);
  const handleSeatSelection = (seat) => {
    // Somente permite seleção se o assento estiver com status "available"
    if (seat.status !== 'available') {
      console.log(`Assento ${seat.row}-${seat.number} não disponível (status: ${seat.status})`);
      return;
    }

    // Verifica se o assento já está selecionado
    const seatIndex = selectedSeats.findIndex(
      (selected) => selected.row === seat.row && selected.number === seat.number
    );

    if (seatIndex === -1) {
      // Adiciona aos assentos selecionados
      console.log(`Adicionando assento ${seat.row}-${seat.number} à seleção`);
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      // Remove dos assentos selecionados
      console.log(`Removendo assento ${seat.row}-${seat.number} da seleção`);
      const newSelected = [...selectedSeats];
      newSelected.splice(seatIndex, 1);
      setSelectedSeats(newSelected);
    }
  };
  const getSeatStatus = (seat) => {
    // Primeiro verifica se o assento está na lista de assentos selecionados pelo usuário
    const isSelected = selectedSeats.some(
      (selected) => selected.row === seat.row && selected.number === seat.number
    );

    // Se estiver selecionado pelo usuário, mostra como "selected"
    if (isSelected) return 'selected';
    
    // Caso contrário, mostra o status atual do assento na sessão (available, occupied, reserved)
    return seat.status || 'available'; // Fallback para "available" caso o status seja indefinido
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('pt-BR', options);
  };

  const calculateTotal = () => {
    if (!session) return 0;
    return selectedSeats.length * session.fullPrice;
  };  // Function to reset seats by making an API call or using local demo
  const handleResetSeats = async () => {
    try {
      setResetLoading(true);
      
      // Limpar seleção de assentos imediatamente para evitar confusão visual
      setSelectedSeats([]);
      
      if (!user || user.role !== 'admin') {
        // For non-admin users, just reset locally (demo purposes)
        const updatedSession = {
          ...session,
          seats: session.seats.map(seat => ({
            ...seat,
            status: 'available' // Set all seats to available
          }))
        };
        
        // Wait for a moment to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Atualiza o estado da sessão com os assentos resetados
        setSession(updatedSession);
        showAlert('Assentos atualizados localmente para demonstração!', 'success');
      } else {
        // For admin users, make the actual API call
        console.log('Resetting seats via API for session:', id);
        try {
          const response = await sessionsService.resetSessionSeats(id);
          
          if (response.success) {
            // Update the session with the response data
            setSession(response.data);
            showAlert('Todos os assentos foram resetados com sucesso!', 'success');
          } else {
            throw new Error(response.message || 'Failed to reset seats');
          }
        } catch (apiErr) {
          console.error('API error resetting seats:', apiErr);
          error('Erro ao resetar assentos via API. Verifique se você tem permissões de admin.');
          throw apiErr; // Re-throw to be caught by the outer catch
        }
      }
    } catch (err) {
      // This catch block will only trigger for the admin flow now
      console.error('Error in reset seats function:', err);
      // Error already shown for API errors
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="seat-selection-container loading-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando detalhes da sessão...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="seat-selection-container error-container">
        <div className="error-message">
          <h2>Sessão não encontrada</h2>
          <p>Não foi possível encontrar os detalhes da sessão solicitada.</p>
          <Link to="/" className="btn btn-primary">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  // Ensure seats is a valid array
  if (!Array.isArray(session.seats)) {
    session.seats = [];
    console.warn('Session seats property is not an array, using empty array');
  }
  
  // Group seats by row
  const seatsByRow = session.seats.reduce((acc, seat) => {
    if (!seat || !seat.row) return acc; // Skip invalid seats
    
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="seat-selection-page">
      <div className="seat-selection-container">        <div className="breadcrumb">
          <div className="breadcrumb-links">
            {session.movie && session.movie._id ? (
              <Link to={`/movies/${session.movie._id}`} className="back-link">
                <FaArrowLeft /> Voltar para detalhes do filme
              </Link>
            ) : (
              <Link to="/" className="back-link">
                <FaArrowLeft /> Voltar para página inicial
              </Link>
            )}
            {user && user.role === 'admin' && (
              <span className="admin-badge">Modo Admin</span>
            )}
          </div><div className="admin-actions">
            <button 
              onClick={handleResetSeats}
              disabled={resetLoading}
              className="btn btn-primary btn-sm reset-seats-btn"
              title={user && user.role === 'admin' ? "Resetar todos os assentos para disponível no banco de dados" : "Torna todos os assentos disponíveis (apenas localmente)"}
            >
              {resetLoading ? 'Processando...' : <><FaSync /> {user && user.role === 'admin' ? 'Resetar Assentos' : 'Liberar Assentos'}</>}
            </button>
          </div>
        </div>

        <div className="session-details">
          <h1>{session.movie.title}</h1>
          <div className="session-meta">
            <p><FaCalendarAlt /> {formatDate(session.datetime)}</p>
            <p><FaClock /> {formatTime(session.datetime)}</p>
            <p><FaMapMarkerAlt /> {session.theater.name} - {session.theater.type}</p>
            <p><FaTicketAlt /> R$ {session.fullPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat-icon available"></div>
            <span>Disponível</span>
          </div>
          <div className="legend-item">
            <div className="seat-icon selected"></div>
            <span>Selecionado</span>
          </div>
          <div className="legend-item">
            <div className="seat-icon reserved"></div>
            <span>Reservado</span>
          </div>
          <div className="legend-item">
            <div className="seat-icon occupied"></div>
            <span>Ocupado</span>
          </div>
        </div>

        <div className="screen">Tela</div>

        <div className="seats-container">
          {Object.entries(seatsByRow)
            .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
            .map(([row, seats]) => (
              <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                <div className="row-seats">
                  {seats
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => (                      <button
                        key={`${seat.row}-${seat.number}`}
                        className={`seat ${getSeatStatus(seat)}`}
                        onClick={() => handleSeatSelection(seat)}
                        disabled={getSeatStatus(seat) !== 'available' && getSeatStatus(seat) !== 'selected'}
                        title={`Fileira ${seat.row}, Assento ${seat.number} - Status: ${getSeatStatus(seat)}`}
                      >
                        <FaCouch />
                        <span className="seat-number">{seat.number}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="selection-summary">
          <div className="selected-seats">
            <h3>Assentos Selecionados:</h3>
            {selectedSeats.length === 0 ? (
              <p>Nenhum assento selecionado</p>
            ) : (
              <ul>
                {selectedSeats
                  .sort((a, b) => {
                    if (a.row !== b.row) return a.row.localeCompare(b.row);
                    return a.number - b.number;
                  })
                  .map((seat) => (
                    <li key={`${seat.row}-${seat.number}`}>
                      Fileira {seat.row}, Assento {seat.number}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="price-summary">
            <div className="price-item">
              <span>Total:</span>
              <span className="price">R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>          <div className="action-buttons">
            <button
              className="btn btn-primary checkout-button"
              disabled={selectedSeats.length === 0}
              onClick={() => {
                navigate('/checkout', {
                  state: {
                    session: session,
                    selectedSeats: selectedSeats.map(seat => ({
                      ...seat,
                      type: 'full' // Default all to full price for demo
                    }))
                  }
                });
              }}
            >
              Continuar para Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
