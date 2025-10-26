import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import useAlert from '../../../hooks/useAlert';
import './styles.css';

const Alert = () => {
  const { alerts, removeAlert } = useAlert();

  // If no alerts, don't render anything
  if (alerts.length === 0) {
    return null;
  }

  // Get icon based on alert type
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className="alerts-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          <div className="alert-icon">
            {getIcon(alert.type)}
          </div>
          <div className="alert-content">
            {alert.message}
          </div>
          <button 
            className="alert-close"
            onClick={() => removeAlert(alert.id)}
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Alert;
