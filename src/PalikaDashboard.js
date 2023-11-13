import React from 'react';
import './PalikaDashboard.css';

function PalikaDashboard() {
  return (
    <div className="palika-dashboard">
      {/* Palika Name */}
      <h1 className="palika-name">Surma Gaupalika Admin Panel</h1>

      {/* Relief Request Section */}
      <div className="section">
        <div className="section-item">
          <h3><i className="fas fa-hands-helping"></i> Relief Requests</h3>
          {/* Add your content for the Relief Request section here */}
        </div>
      </div>

      {/* Data Upload Section */}
      <div className="section">
        <div className="section-item">
          <h3><i className="fas fa-upload"></i> Data Upload</h3>
          {/* Add your content for the Data Upload section here */}
        </div>
      </div>
    </div>
  );
}

export default PalikaDashboard;
