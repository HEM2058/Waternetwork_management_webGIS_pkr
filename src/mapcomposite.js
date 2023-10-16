import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Filter from './Filter';
import OpenLayersMap from './map';
import './mapcomposite.css'; // Import your CSS file for styling

function MapComposite() {
  const [showFilter, setShowFilter] = useState(true);

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
    </div>
  );
}

export default MapComposite;
