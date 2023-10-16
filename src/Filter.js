import React, { useState } from 'react';
import './Filter.css';

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
  'Surma',
  'Talkot',
  'Thalara',
];

const layers = ['Layer 1', 'Layer 2', 'Layer 3'];

function Filter() {
  const [selectedPalika, setSelectedPalika] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('Layer 1');
  const [selectedAttribute, setSelectedAttribute] = useState('Attribute X');
  const [fieldValue, setFieldValue] = useState('');

  const handlePalikaChange = (event) => {
    setSelectedPalika(event.target.value);
  };

  const handleLayerChange = (event) => {
    setSelectedLayer(event.target.value);
  };

  const handleAttributeChange = (event) => {
    setSelectedAttribute(event.target.value);
  };

  const handleFieldValueChange = (event) => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Selected Palika:', selectedPalika);
    console.log('Selected Layer:', selectedLayer);
    console.log('Selected Attribute:', selectedAttribute);
    console.log('Field Value:', fieldValue);
  };

  return (
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
        <label htmlFor="layerSelect">Select Layer</label>
        <select id="layerSelect" value={selectedLayer} onChange={handleLayerChange}>
          {layers.map((layer, index) => (
            <option key={index} value={layer}>
              {layer}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="attributesSelect">Select Field</label>
        <select id="attributesSelect" value={selectedAttribute} onChange={handleAttributeChange}>
          <option>Attribute X</option>
          <option>Attribute Y</option>
          <option>Attribute Z</option>
        </select>
      </div>

      <div className="filter">
        <label htmlFor="fieldValueInput">Enter Value</label>
        <input
          type="text"
          id="fieldValueInput"
          value={fieldValue}
          onChange={handleFieldValueChange}
        />
      </div>

      <div className="filter">
        <button onClick={handleSubmit}>Run</button>
      </div>
    </div>
  );
}

export default Filter;
