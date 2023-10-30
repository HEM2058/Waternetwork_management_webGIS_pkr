import React, { useState, useEffect } from 'react';
import './Filter.css';
import OpenLayersMap from './map';

function Filter() {
  const [apiData, setApiData] = useState([]);
  const [selectedPalika, setSelectedPalika] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('Layer 1');
  const [availableLayers, setAvailableLayers] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://127.0.0.1:2500/geoshp/')
      .then((response) => response.json())
      .then((data) => {
        // Extract distinct Palika values from the API data
        const distinctPalikas = [...new Set(data.map((item) => item.Palika))];
        setApiData(data);
        setAvailableLayers(distinctPalikas.map((palika) => {
          const palikaLayers = data.filter((item) => item.Palika === palika);
          return {
            palika,
            layers: palikaLayers.map((item) => item.name),
          };
        }));
        // Set the selectedPalika initially to the first distinct Palika (if available)
        if (distinctPalikas.length > 0) {
          setSelectedPalika(distinctPalikas[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handlePalikaChange = (event) => {
    setSelectedPalika(event.target.value);
    // Reset the selected layer when the municipality changes
    setSelectedLayer(availableLayers.find((layer) => layer.palika === event.target.value)?.layers[0] || 'Layer 1');
  };

  const handleLayerChange = (event) => {
    setSelectedLayer(event.target.value);
  };

  return (
    <>
      <div className="filter-container">
        <div className="filter">
          <label htmlFor="palikaSelect">Select Palika</label>
          <select id="palikaSelect" value={selectedPalika} onChange={handlePalikaChange}>
            <option value="">Select a Palika</option>
            {availableLayers.map((item, index) => (
              <option key={index} value={item.palika}>
                {item.palika}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label htmlFor="layerSelect">Select Layer</label>
          <select id="layerSelect" value={selectedLayer} onChange={handleLayerChange}>
            {availableLayers.find((layer) => layer.palika === selectedPalika)?.layers.map((layer, index) => (
              <option key={index} value={layer}>
                {layer}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Include the OpenLayersMap component here */}
      <OpenLayersMap selectedPalika={selectedPalika} selectedLayer={selectedLayer} />
    </>
  );
}

export default Filter;
