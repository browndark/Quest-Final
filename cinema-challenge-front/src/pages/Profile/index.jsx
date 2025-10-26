import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaKey, FaSave, FaExclamationTriangle, 
  FaCheckCircle, FaTimes, FaTicketAlt, FaCalendarAlt, 
  FaFilm, FaMapMarkerAlt, FaClock 
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';
import reservationsService from '../../api/reservations';
import './styles.css';

const Profile = () => {  const { user, isAuthenticated, updateProfile } = useAuth();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Debug log when component renders
  console.log('Profile component rendering with user:', user);  // Effect to update form data when user changes
  useEffect(() => {
    if (user) {
      console.log('User data in Profile component:', user);
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Effect to load user reservations
  useEffect(() => {
    const loadReservations = async () => {
      if (!isAuthenticated) return;
      
      try {
        setReservationsLoading(true);
        const response = await reservationsService.getMyReservations();
        
        if (response && response.success && response.data) {
          setReservations(response.data);
        } else {
          console.error('Error loading reservations:', response);
        }
      } catch (error) {
        console.error('Failed to load reservations:', error);
      } finally {
        setReservationsLoading(false);
      }
    };
    
    loadReservations();
  }, [isAuthenticated]);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Debug log before render to check data is current
  console.log('Rendering profile with form data:', formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit triggered');
    console.log('Current form data:', formData);
    
    // Check if name has actually changed
    if (user && user.name === formData.name) {
      console.log('Name has not changed, showing notice');
      showAlert('Nenhuma alteração foi feita.', 'info');
      return;
    }
    
    // Simple validation
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      showAlert('As novas senhas não coincidem.', 'error');
      return;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      showAlert('Digite sua senha atual para confirmar a alteração de senha.', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Calling updateProfile with name:', formData.name);
      // For now, just update the name (API integration for password will come later)
      const result = await updateProfile({ name: formData.name });
      console.log('Update profile result:', result);
        if (result && result.success) {
        // Set success message and show modal
        setSuccessMessage(result.message || 'Perfil atualizado com sucesso!');
        setShowSuccessModal(true);
        
        // Also show alert for users without JS
        showAlert(result.message || 'Perfil atualizado com sucesso!', 'success');
        
        // Update the form with the new data returned from context
        if (result.user) {
          console.log('Updating form with new user data:', result.user);
          setFormData(prevState => ({
            ...prevState,
            name: result.user.name || '',
            email: result.user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          }));
        } else {
          // Just clear password fields
          setFormData(prevState => ({
            ...prevState,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          }));
        }
      }else {
        throw new Error((result && result.error) || 'Erro ao atualizar perfil.');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  // Close success modal
  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="profile-page">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-header">
              <FaCheckCircle className="success-icon" />
              <button className="close-button" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <h2>Sucesso!</h2>
            <p>{successMessage}</p>
            <button className="btn btn-primary" onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
        <div className="profile-container">
        <div className="profile-tabs">
          <div className="tab active">
            <FaUser /> Meu Perfil
          </div>
          <div className="tab">
            <FaTicketAlt /> Minhas Reservas
          </div>
        </div>
        
        <div className="profile-header">
          <h1><FaUser /> Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e credenciais de acesso</p>
        </div>
        
        <div className="profile-content">
          <div className="section user-info">
            <h2>Informações Pessoais</h2>
            <form onSubmit={handleSubmit} className="profile-form"><div className="form-group">
              <label htmlFor="name">
                <FaUser /> Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
                className={loading ? "loading-input" : ""}
              />
              {user && user.name && user.name !== formData.name && (
                <small className="changed-field">Campo alterado. Clique em Salvar para confirmar.</small>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
              <small>O e-mail não pode ser alterado</small>
            </div>
            
            <div className="password-section">
              <h3><FaKey /> Alterar Senha</h3>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Senha Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha atual"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Digite a nova senha"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirme a Nova Senha</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirme a nova senha"
                />
              </div>
              
              <div className="password-notice">
                <FaExclamationTriangle />
                <span>
                  A função de alterar senha estará disponível em breve.
                  Por enquanto, apenas a atualização do nome é suportada.
                </span>
              </div>
            </div>
            
            <div className="form-actions">              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || (user && user.name === formData.name && !formData.newPassword)}
                title={user && user.name === formData.name && !formData.newPassword ? "Não há alterações a salvar" : "Salvar alterações"}
              >
                {loading ? 'Salvando...' : (
                  <>
                    <FaSave /> Salvar Alterações
                  </>
                )}
              </button>            </div>
          </form>
          </div>
          
          <div className="section reservations-section">
            <h2><FaTicketAlt /> Minhas Reservas</h2>
            
            {reservationsLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando suas reservas...</p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="empty-reservations">
                <p>Você ainda não possui nenhuma reserva.</p>
                <Link to="/movies" className="btn btn-primary">Explorar Filmes</Link>
              </div>
            ) : (
              <div className="reservations-list">
                {reservations.map(reservation => (
                  <div key={reservation._id} className="reservation-card">
                    <div className="movie-info">
                      {reservation.session?.movie?.poster ? (
                        <img 
                          src={reservation.session.movie.poster} 
                          alt={reservation.session.movie.title} 
                          className="movie-poster"
                        />
                      ) : (
                        <div className="poster-placeholder">
                          <FaFilm />
                        </div>
                      )}
                      
                      <div className="reservation-details">
                        <h3>{reservation.session?.movie?.title || 'Filme não disponível'}</h3>
                        
                        <div className="session-info">
                          <p>
                            <FaCalendarAlt /> 
                            {reservation.session?.datetime 
                              ? new Date(reservation.session.datetime).toLocaleDateString('pt-BR') 
                              : 'Data não disponível'}
                          </p>
                          <p>
                            <FaClock /> 
                            {reservation.session?.datetime 
                              ? new Date(reservation.session.datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                              : 'Horário não disponível'}
                          </p>
                          <p>
                            <FaMapMarkerAlt /> 
                            {reservation.session?.theater?.name || 'Cinema não disponível'}
                          </p>
                        </div>
                        
                        <div className="seats-info">
                          <strong>Assentos:</strong> 
                          {reservation.seats.map(seat => (
                            <span key={`${seat.row}-${seat.number}`} className="seat-tag">
                              {seat.row}{seat.number} ({seat.type === 'half' ? 'Meia' : 'Inteira'})
                            </span>
                          ))}
                        </div>
                        
                        <div className="reservation-footer">
                          <span className={`status-badge ${reservation.status}`}>
                            {reservation.status === 'confirmed' ? 'Confirmada' : 
                             reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
                          </span>
                          <span className="price">
                            R$ {reservation.totalPrice?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
