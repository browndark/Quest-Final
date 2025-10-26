import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/auth';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Ensure loading is set to true at the start
      
      try {
        console.log('Running checkAuth in AuthContext');
        
        if (authService.isAuthenticated()) {
          console.log('Token exists in localStorage');
          const userData = authService.getCurrentUser();
          console.log('User data from localStorage:', userData);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(userData.role === 'admin');
            console.log('User authenticated from localStorage:', {
              isAuthenticated: true,
              isAdmin: userData.role === 'admin'
            });
          } else {
            console.log('No user data in localStorage despite token existing');
            authService.logout();
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUser(null);
          }
        } else {
          console.log('Not authenticated (no token in localStorage)');
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear any invalid tokens
        authService.logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        const { token, ...userInfo } = response.data;
        setUser(userInfo);
        setIsAuthenticated(true);
        setIsAdmin(userInfo.role === 'admin');
        return { success: true };
      }
    } catch (err) {
      setError(err.message || 'Falha ao registrar. Tente novamente.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      console.log('Login response in context:', response);
      
      if (response.success) {
        // Get the user info based on the response structure from backend
        // Backend returns: { success: true, data: { _id, name, email, role, token } }
        const userInfo = response.data;
        
        console.log('Setting auth state with user data:', userInfo);
        
        // Update context state
        setUser(userInfo);
        setIsAuthenticated(true);
        setIsAdmin(userInfo.role === 'admin');
        
        console.log('Auth state after login:', {
          isAuthenticated: true,
          isAdmin: userInfo.role === 'admin',
          user: userInfo
        });
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed with unknown error');
      }
    } catch (err) {
      console.error('Login error in context:', err);
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('updateProfile called with data:', updatedData);
      console.log('Current user before update:', user);
      
      // Call the API to update the profile
      const response = await authService.updateProfile(updatedData);
      console.log('API profile update response:', response);
      
      if (response.success && response.data) {
        // Update user state with the data returned from API
        setUser(response.data);
        
        console.log('Profile updated successfully with data from API:', response.data);
        
        // Return success and the updated user
        return { 
          success: true,
          user: response.data,
          message: response.message || 'Perfil atualizado com sucesso'
        };
      } else {
        throw new Error(response.message || 'Falha ao atualizar perfil');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Falha ao atualizar perfil. Tente novamente.');
      return { 
        success: false, 
        error: err.message,
        user: user
      };
    } finally {
      setLoading(false);
    }
  };

  // Value object to be provided to consumers
  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
