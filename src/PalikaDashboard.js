import React from 'react';
import './PalikaDashboard.css';

function PalikaDashboard() {
  return (
    <div className="palika-dashboard">
      {/* Palika Name */}
      <h1 className="palika-name">Surma Gaupalika Admin Panel</h1>

      {/* Sections */}
      <div className='sections'>

        {/* Relief Request Section */}
        <div className="section">
          <div className="section-item">
            <h3><i className="fas fa-hands-helping"></i> Relief Requests</h3>
            {/* Add your content for the Relief Request section here */}
          </div>
        </div>

        {/* Add Place Section */}
        <div className="section">
          <div className="section-item">
            <h3><i className="fas fa-map-marker-alt"></i> Add Place</h3>
            {/* Add your content for the Add Place section here */}
          </div>
        </div>

        {/* Publish Layer Section */}
        <div className="section">
          <div className="section-item">
            <h3><i className="fas fa-layer-group"></i> Publish Layer</h3>
            {/* Add your content for the Publish Layer section here */}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PalikaDashboard;
