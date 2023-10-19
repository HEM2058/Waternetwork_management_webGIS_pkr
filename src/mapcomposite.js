import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Filter from './Filter';
import OpenLayersMap from './map';
import './mapcomposite.css'; // Import your CSS file for styling
import { Link } from 'react-router-dom';
function MapComposite() {
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="map-container">
      <div className={`filter-toggle ${showFilter ? 'active' : ''}`}>
        <button onClick={toggleFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>
      {showFilter && <Filter />}
      <OpenLayersMap />
      
      {/* Relief Request Button */}
      <div className="relief-request-button">
       <Link to="/QuickAid" >
              Relief Request
             
              </Link>
      </div>
    </div>
  );
}

function handleReliefRequestClick() {
  // Implement the logic for handling the relief request here
  // For example, you can open a modal or navigate to a relief request page.
}

export default MapComposite;
