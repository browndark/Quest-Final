import React from 'react';
import ApiDiagnostics from '../../components/admin/ApiDiagnostics';
import './styles.css';

const ApiDiagnosticsPage = () => {
  return (
    <div className="api-diagnostics-page">
      <h1>API Integration Diagnostics</h1>
      <p className="description">
        This tool helps identify and resolve integration issues between the frontend and backend.
      </p>
      <ApiDiagnostics />
    </div>
  );
};

export default ApiDiagnosticsPage;
