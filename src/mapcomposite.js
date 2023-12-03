import React, { useState, useEffect } from 'react';
import OpenLayersMap from './map';
import './mapcomposite.css';
import ApiDataFetcher from './ApiDataFetcher';
import NetworkAnalysis from './Networkanalysis';
import Sidebar from './sidebar';
import Leakage from './Leakage';

function MapComposite() {
  const [apiData, setApiData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [fillInputMode, setFillInputMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [renderedComponent, setRenderedComponent] = useState(null);

  const handleDataFetched = (data) => {
    setApiData(data);
    setIsDataLoaded(true);
  };

  const handleMapClick = (coordinate) => {
    setSelectedCoordinate(coordinate);
  };

  const handleFillInputCallback = (value) => {
    setFillInputMode(value);
    console.log('Callback value from NetworkAnalysis:', value);
  };

  
  return (
    <div className="map-composite-container">

      {renderedComponent}

      <div className="map-container">
        <ApiDataFetcher onDataFetched={handleDataFetched} />
        {isDataLoaded ? <OpenLayersMap apiData={apiData} onMapClick={handleMapClick} /> : null}
      </div>
    </div>
  );
}

export default MapComposite;
