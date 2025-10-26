import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTicketAlt, FaBars, FaTimes } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import './styles.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use authentication state from context
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };
  // Show authentication status in console for debugging
  console.log('Authentication state in Header:', { isAuthenticated, isAdmin });

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>Cinema App</h1>
          </Link>
        </div>

        <div className="mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>        <nav className={`nav ${isMenuOpen ? 'show' : ''}`}>
          <ul>
            <li>
              <Link to="/movies" onClick={() => setIsMenuOpen(false)}>
                Filmes em Cartaz
              </Link>
            </li>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Início
              </Link>
            </li>
            {isAuthenticated ? (
              <>                <li>
                  <Link to="/reservations" onClick={() => setIsMenuOpen(false)}>
                    <FaTicketAlt /> Minhas Reservas
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <FaUser /> Perfil
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      Administração
                    </Link>
                  </li>
                )}
                <li>
                  <button className="btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="btn" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
