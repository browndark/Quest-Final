import React, { createContext, useState, useCallback } from 'react';

// Create the alert context
export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Add a new alert
  const addAlert = useCallback((message, type = 'info', timeout = 5000) => {
    const id = Date.now();
    
    // Add new alert to the alerts array
    setAlerts(prevAlerts => [...prevAlerts, { id, message, type }]);
    
    // Remove alert after timeout
    if (timeout) {
      setTimeout(() => {
        removeAlert(id);
      }, timeout);
    }
    
    return id;
  }, []);

  // Remove an alert by id
  const removeAlert = useCallback(id => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  }, []);

  // Helper methods for different alert types
  const success = useCallback((message, timeout) => {
    return addAlert(message, 'success', timeout);
  }, [addAlert]);

  const error = useCallback((message, timeout) => {
    return addAlert(message, 'error', timeout);
  }, [addAlert]);

  const warning = useCallback((message, timeout) => {
    return addAlert(message, 'warning', timeout);
  }, [addAlert]);

  const info = useCallback((message, timeout) => {
    return addAlert(message, 'info', timeout);
  }, [addAlert]);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Value object to be provided to consumers
  const value = {
    alerts,
    addAlert,
    removeAlert,
    success,
    error,
    warning,
    info,
    clearAlerts
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export default AlertProvider;
