import React, { useState } from 'react';
import './Filter.css';
import OpenLayersMap from './map';

const localLevels = [
  'Bithadchir',
  'Bungal',
  'Chabispathivera',
  'Durgathali',
  'JayaPrithivi',
  'Kanda',
  'Kedarseu',
  'Khaptadchhanna',
  'Masta',
  'Saipal',
  'Surma',
  'Talkot',
  'Thalara',
];

const layers = {
  'Bithadchir': ['Layer 1', 'Layer 2', 'Layer 3'],
  'Bungal': ['Layer 4', 'Layer 5', 'Layer 6'],
  // Define layers for other municipalities here...
};

function Filter() {
  const [selectedPalika, setSelectedPalika] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('Layer 1');

  const handlePalikaChange = (event) => {
    setSelectedPalika(event.target.value);
    // Reset the selected layer when the municipality changes
    setSelectedLayer(layers[event.target.value][0]);
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
            {localLevels.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Select Layer</label>
          {layers[selectedPalika] && layers[selectedPalika].map((layer, index) => (
            <label key={index}>
              <input
                type="radio"
                name="layer"
                value={layer}
                checked={selectedLayer === layer}
                onChange={handleLayerChange}
              />
              {layer}
            </label>
          ))}
        </div>
      </div>

      {/* Include the OpenLayersMap component here */}
      <OpenLayersMap selectedPalika={selectedPalika} selectedLayer={selectedLayer} />
    </>
  );
}

export default Filter;
