import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';
import './styles.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const { error, success } = useAlert();
  const navigate = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      error('Todos os campos são obrigatórios.');
      return;
    }
    
    if (password !== confirmPassword) {
      error('As senhas não coincidem.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting registration with data:', { name, email, password: '****' });
      const result = await register({ name, email, password });
      
      console.log('Registration result:', result);
      
      if (result && result.success) {
        success('Conta criada com sucesso!');
        navigate('/login');
      } else {
        error(result?.message || result?.error || 'Erro ao criar conta.');
      }
    } catch (err) {
      console.error('Registration error details:', err);
      error(`Erro ao criar conta: ${err.message || 'Tente novamente mais tarde'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Cadastro</h1>
        <p>Crie sua conta para reservar ingressos</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
