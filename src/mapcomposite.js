import React, { useState } from 'react';
import OpenLayersMap from './map';
import './mapcomposite.css';
import ApiDataFetcher from './ApiDataFetcher';
import NetworkAnalysis from './Networkanalysis';
import { Link } from 'react-router-dom';

function MapComposite() {
  const [apiData, setApiData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [fillInputMode, setFillInputMode] = useState(false);
  

  const handleDataFetched = (data) => {
    setApiData(data);
    setIsDataLoaded(true);
  };

  const handleMapClick = (coordinate) => {
   
    setSelectedCoordinate(coordinate);

    // setFillInputMode(true); // Set fillInputMode to true when the map is clicked
  };

  const handleFillInputCallback = (value) => {
    // Handle the callback value from NetworkAnalysis
    setFillInputMode(value)
    console.log('Callback value from NetworkAnalysis:', value);
    // Perform further actions based on the value if needed
  };
 // Define a no-op function
 const noOp = () => {};
  return (
    <div className="map-composite-container">
      <div className="left-panel">
        <NetworkAnalysis
          selectedCoordinate={selectedCoordinate}
          fillInputMode={fillInputMode}
          onFillInputCallback={handleFillInputCallback}
        />
      </div>

      <div className="map-container">
        <ApiDataFetcher onDataFetched={handleDataFetched} />
        {isDataLoaded ? (
      <OpenLayersMap
      apiData={apiData}
      onMapClick={handleMapClick}
    />
    
        ) : null}
      </div>
    </div>
  );
}

export default MapComposite;