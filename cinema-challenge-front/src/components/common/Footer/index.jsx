import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import './styles.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>Cinema App</h3>
          <p>Seu aplicativo completo para reserva de ingressos de cinema.</p>
        </div>

        <div className="footer-section">
          <h3>Links Úteis</h3>
          <ul>
            <li>
              <Link to="/">Filmes em Cartaz</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Cadastre-se</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <p>
            <FaEnvelope /> contato@cinemaapp.com
          </p>
          <p>Tel: (11) 5555-5555</p>
        </div>

        <div className="footer-section">
          <h3>Siga-nos</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Cinema App. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
