import React from 'react';
import useAuth from '../../../hooks/useAuth';
import './styles.css';

const AuthStatus = () => {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();
  
  return (
    <div className="auth-status-debug">
      <h3>Auth Status Debug</h3>
      <div className="auth-status-content">
        <div className="status-item">
          <span className="label">Loading:</span>
          <span className="value">{loading ? 'True' : 'False'}</span>
        </div>
        <div className="status-item">
          <span className="label">Authenticated:</span>
          <span className="value">{isAuthenticated ? 'True' : 'False'}</span>
        </div>
        <div className="status-item">
          <span className="label">Admin:</span>
          <span className="value">{isAdmin ? 'True' : 'False'}</span>
        </div>
        {user && (
          <>
            <div className="status-item">
              <span className="label">User Name:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="status-item">
              <span className="label">User Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="status-item">
              <span className="label">User Role:</span>
              <span className="value">{user.role}</span>
            </div>
          </>
        )}
        <div className="status-item">
          <span className="label">Token:</span>
          <span className="value">
            {localStorage.getItem('token') ? 'Present' : 'Not found'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthStatus;
