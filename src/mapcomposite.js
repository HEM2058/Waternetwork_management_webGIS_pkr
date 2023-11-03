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
  const [selectedBaseLayer, setSelectedBaseLayer] = useState('osm'); // Default base layer

  const handleDataFetched = (data, selectedLayer) => {
    setApiData(data); // Store the data in the state
    setIsDataLoaded(true); // Set the data-loaded flag to true
    setSelectedBaseLayer(selectedLayer); // Set the selected base layer
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="map-container">
      <ApiDataFetcher onDataFetched={handleDataFetched} />
      {isDataLoaded ? (
        <OpenLayersMap apiData={apiData} selectedBaseLayer={selectedBaseLayer} />
      ) : null}
    </div>
  );
}

export default MapComposite;
