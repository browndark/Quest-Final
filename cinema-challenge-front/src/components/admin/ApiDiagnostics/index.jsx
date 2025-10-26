import React, { useState } from 'react';
import './styles.css';
import { runAllTests, testServerConnection, testAuthFlow, testMovieEndpoints, checkCommonEndpoints } from '../../../utils/apiTestTool';
import { runAllConnectionTests, testDirectConnection, testProxyConnection, testAuthEndpointsInDepth } from '../../../utils/apiConnectionTest';

// A helpful diagnostic tool to identify API integration issues
const ApiDiagnostics = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to add log messages to results
  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  // Override console methods to capture logs
  const runWithLogCapture = async (testFunction) => {
    setIsLoading(true);
    
    // Save original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalGroup = console.group;
    const originalGroupEnd = console.groupEnd;
    
    // Override methods to capture logs
    console.log = (message, ...args) => {
      originalLog(message, ...args);
      let displayMessage = message;
      if (typeof message === 'object') {
        displayMessage = JSON.stringify(message, null, 2);
      }
      if (args.length) {
        const argsStr = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
        displayMessage = `${displayMessage} ${argsStr}`;
      }
      addResult(displayMessage, 'info');
    };
    
    console.error = (message, ...args) => {
      originalError(message, ...args);
      addResult(typeof message === 'object' ? JSON.stringify(message, null, 2) : message, 'error');
    };
    
    console.warn = (message, ...args) => {
      originalWarn(message, ...args);
      addResult(typeof message === 'object' ? JSON.stringify(message, null, 2) : message, 'warning');
    };
    
    console.group = (title) => {
      originalGroup(title);
      addResult(`📋 ${title}`, 'group');
    };
    
    console.groupEnd = () => {
      originalGroupEnd();
      addResult('', 'groupEnd');
    };
    
    try {
      await testFunction();
    } catch (error) {
      addResult(`Test execution error: ${error.message}`, 'error');
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.group = originalGroup;
      console.groupEnd = originalGroupEnd;
      
      setIsLoading(false);
    }
  };

  // Run all diagnostic tests
  const handleRunAllTests = () => {
    setResults([]);
    runWithLogCapture(runAllTests);
  };

  // Run specific tests
  const handleServerConnectionTest = () => {
    setResults([]);
    runWithLogCapture(testServerConnection);
  };
  
  const handleAuthTest = () => {
    setResults([]);
    runWithLogCapture(testAuthFlow);
  };
  
  const handleMoviesTest = () => {
    setResults([]);
    runWithLogCapture(testMovieEndpoints);
  };
  
  const handleEndpointsTest = () => {
    setResults([]);
    runWithLogCapture(checkCommonEndpoints);
  };

  return (
    <div className="api-diagnostics">
      <h2>API Integration Diagnostics</h2>
      <p>Use this tool to diagnose issues with API integration between the frontend and backend</p>
      
      <div className="diagnostic-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleRunAllTests} 
          disabled={isLoading}
        >
          Run All Tests
        </button>
          <div className="button-group">
          <h4>Individual Tests</h4>
          <button onClick={handleServerConnectionTest} disabled={isLoading}>Test Server Connection</button>
          <button onClick={handleAuthTest} disabled={isLoading}>Test Authentication</button>
          <button onClick={handleMoviesTest} disabled={isLoading}>Test Movies API</button>
          <button onClick={handleEndpointsTest} disabled={isLoading}>Check Endpoints</button>
          <button 
            onClick={() => { setResults([]); runWithLogCapture(runAllConnectionTests); }} 
            disabled={isLoading}
            className="advanced-test-btn"
          >
            Advanced Connection Tests
          </button>
          <button 
            onClick={() => { setResults([]); runWithLogCapture(testAuthEndpointsInDepth); }} 
            disabled={isLoading}
            className="advanced-test-btn"
          >
            Detailed Auth Tests
          </button>
        </div>
      </div>
      
      <div className="results-container">
        <h3>Test Results</h3>
        {isLoading && <div className="loading">Running tests...</div>}
        
        <div className="results-log">
          {results.length === 0 && !isLoading ? (
            <p className="no-results">Run tests to see results</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className={`log-entry ${result.type}`}>
                <span className="timestamp">{result.timestamp}</span>
                <pre className="log-message">{result.message}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDiagnostics;
