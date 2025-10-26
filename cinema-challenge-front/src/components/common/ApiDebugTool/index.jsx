import React, { useState } from 'react';
import axios from 'axios';
import './api-debug.css';

/**
 * API Debug Tool Component
 * A floating debugger tool that can be used to make direct API requests
 * and test the backend integration
 */
const ApiDebugTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [endpoint, setEndpoint] = useState('/auth/login');
  const [method, setMethod] = useState('post');
  const [payload, setPayload] = useState('{\n  "email": "test@example.com",\n  "password": "password123"\n}');
  const [token, setToken] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toggle the debugger open/closed
  const toggleDebugger = () => setIsOpen(prev => !prev);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      // Parse the payload
      const parsedPayload = method !== 'get' ? JSON.parse(payload) : {};
      
      // Setup headers
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Build request config
      const config = {
        headers
      };
      
      // Make the request
      let apiResponse;
      const baseUrl = '/api/v1';
      
      if (method === 'get') {
        apiResponse = await axios.get(`${baseUrl}${endpoint}`, config);
      } else if (method === 'post') {
        apiResponse = await axios.post(`${baseUrl}${endpoint}`, parsedPayload, config);
      } else if (method === 'put') {
        apiResponse = await axios.put(`${baseUrl}${endpoint}`, parsedPayload, config);
      } else if (method === 'delete') {
        apiResponse = await axios.delete(`${baseUrl}${endpoint}`, config);
      }
      
      // Set the response
      setResponse({
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        data: apiResponse.data
      });
      
      // If it's a login response, extract the token
      if (endpoint === '/auth/login' && apiResponse.data.success && apiResponse.data.data?.token) {
        setToken(apiResponse.data.data.token);
      }
      
    } catch (err) {
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-debug-tool">
      <button 
        className="api-debug-toggle-button"
        onClick={toggleDebugger}
        title="Toggle API Debug Tool"
      >
        {isOpen ? '✕' : '🔧'}
      </button>
      
      {isOpen && (
        <div className="api-debug-panel">
          <div className="api-debug-header">
            <h3>API Debug Tool</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="api-debug-form">
            <div className="form-group">
              <div className="method-url">
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="method-select"
                >
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="delete">DELETE</option>
                </select>
                
                <div className="endpoint-wrapper">
                  <span className="base-url">/api/v1</span>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="/endpoint"
                    className="endpoint-input"
                  />
                </div>
              </div>
            </div>
            
            {method !== 'get' && (
              <div className="form-group">
                <label>Request Payload</label>
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="payload-input"
                  rows={5}
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Auth Token (Optional)</label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="token-input"
                rows={3}
                placeholder="JWT token for authenticated requests"
              />
            </div>
            
            <button 
              type="submit" 
              className="send-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </form>
          
          <div className="api-debug-response">
            <h4>Response</h4>
            
            {loading && <div className="loading">Loading...</div>}
            
            {error && (
              <div className="error-container">
                <h5>Error: {error.status} {error.statusText}</h5>
                <p>{error.message}</p>
                {error.data && (
                  <pre>{JSON.stringify(error.data, null, 2)}</pre>
                )}
              </div>
            )}
            
            {response && (
              <div className="response-container">
                <h5>Status: {response.status} {response.statusText}</h5>
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugTool;
