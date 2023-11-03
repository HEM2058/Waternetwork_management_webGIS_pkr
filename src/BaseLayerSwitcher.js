import { useState } from "react";
import React from 'react';

const BaseLayerSwitcher = () => {
  const [activeBaseLayer, setActiveBaseLayer] = useState('OSM');

  const handleBaseLayerChange = (baseLayer) => {
    setActiveBaseLayer(baseLayer);
  };

  return (
    <div className="base-layer-switcher">
      <h1>Base Layer Switcher</h1>
      <ul>
        <li>
          <input
            type="radio"
            name="base-layer"
            checked={activeBaseLayer === 'OSM'}
            onChange={() => handleBaseLayerChange('OSM')}
          />
          OpenStreetMap
        </li>
        <li>
          <input
            type="radio"
            name="base-layer"
            checked={activeBaseLayer === 'googleSatellite'}
            onChange={() => handleBaseLayerChange('googleSatellite')}
          />
         Google Satelite
        </li>
     
      </ul>
    </div>
  );
};

export default BaseLayerSwitcher;
