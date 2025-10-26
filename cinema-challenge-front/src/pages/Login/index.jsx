import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { error, success } = useAlert();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    console.log('Login component - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      error('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Attempting login with:', { email });
    
    try {
      const result = await login({ email, password });
      console.log('Login result:', result);
      
      if (result && result.success) {
        success('Login realizado com sucesso!');
        // Navigation will happen in useEffect when isAuthenticated changes
      } else {
        error(result?.error || 'Erro ao fazer login. Tente novamente.');
      }
    } catch (err) {
      error('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Login</h1>
          <p>Entre com suas credenciais para acessar sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-with-icon">
              <FaEnvelope />
              <input
                type="email"
                id="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-with-icon">
              <FaLock />
              <input
                type="password"
                id="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
