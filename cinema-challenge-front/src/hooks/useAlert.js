import { useContext } from 'react';
import { AlertContext } from '../context/AlertContext';

/**
 * Custom hook to use alert context
 * 
 * @returns {Object} Alert context values and methods
 */
const useAlert = () => {
  const context = useContext(AlertContext);
  
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  
  return context;
};

export default useAlert;
