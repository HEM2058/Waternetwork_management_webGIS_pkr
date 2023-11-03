import React, { useEffect, useState } from 'react';

function ApiDataFetcher({ onDataFetched }) {
  const [apiData, setApiData] = useState([]);
  const [selectedBaseLayer, setSelectedBaseLayer] = useState('googleSatellite'); // Default to OpenStreetMap

  const handleBaseLayerChange = (layer) => {
    setSelectedBaseLayer(layer);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:2500/geoshp/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Pass the selectedBaseLayer and apiData to the parent component
  useEffect(() => {
    onDataFetched(apiData, selectedBaseLayer);
  }, [onDataFetched, apiData, selectedBaseLayer]);

  return (
    <div className="button-container">
      <button onClick={() => handleBaseLayerChange('osm')}>Switch to OpenStreetMap</button>
      <button onClick={() => handleBaseLayerChange('googleSatellite')}>Switch to Google Satellite</button>
    </div>
  );
}

export default ApiDataFetcher;
