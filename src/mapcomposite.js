import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import OpenLayersMap from './map';
import './mapcomposite.css'; // Import your CSS file for styling
import ApiDataFetcher from './ApiDataFetcher';
import { Link } from 'react-router-dom';
function MapComposite() {
  const [showFilter, setShowFilter] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleDataFetched = (data) => {
    setApiData(data); // Store the data in the state
    setIsDataLoaded(true); // Set the data-loaded flag to true
  };
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="map-container">
      {/* <div className={`filter-toggle ${showFilter ? 'active' : ''}`}>
        <button onClick={toggleFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div> */}
     
      <ApiDataFetcher onDataFetched={handleDataFetched} />
      {isDataLoaded ? null:( // Conditional rendering of OpenLayersMap
  <OpenLayersMap apiData={apiData} />
) }

      
    
    </div>
  );
}

function handleReliefRequestClick() {
  // Implement the logic for handling the relief request here
  // For example, you can open a modal or navigate to a relief request page.
}

export default MapComposite;
