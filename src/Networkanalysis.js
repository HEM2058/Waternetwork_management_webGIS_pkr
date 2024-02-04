import React, { useState, useEffect } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function NetworkAnalysis({ selectedCoordinate, apiData }) {
  const [inputValue, setInputValue] = useState('');
  const [fillInputMode, setFillInputMode] = useState(false);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Extract unique names from apiData for each feature type
    const uniqueNames = {
      reservoir: apiData.features
        .filter((feature) => feature.properties.name.toLowerCase().includes('reservoir'))
        .map((feature) => feature.properties.name),
      tubewell: apiData.features
        .filter((feature) => feature.properties.name.toLowerCase().includes('tubewell'))
        .map((feature) => feature.properties.name),
      overheadtank: apiData.features
        .filter((feature) => feature.properties.name.toLowerCase().includes('overhead'))
        .map((feature) => feature.properties.name),
    };

    // Generate features array based on unique names
    const generatedFeatures = Object.keys(uniqueNames).map((type, index) => ({
      id: index + 1,
      uniqueName: `shortestRoute${type.charAt(0).toUpperCase() + type.slice(1)}`,
      name: `Shortest Route to ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: `Find the shortest route to the ${type}.`,
      isExpanded: false,
      options: uniqueNames[type],
    }));

    setFeatures(generatedFeatures);
  }, [apiData]);

  const handleFeatureClick = (uniqueName) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.uniqueName === uniqueName
          ? { ...feature, isExpanded: !feature.isExpanded }
          : feature
      )
    );
  };

  const handleInfoClick = (uniqueName) => {
    console.log(`Info clicked for feature with unique name: ${uniqueName}`);
    // You can implement further actions, such as displaying a modal with detailed information
  };

  const handleApplyAnalysis = (uniqueName) => {
    console.log(`Applying network analysis for feature: ${uniqueName}`);
    // Implement the logic for applying network analysis based on the selected feature
  };

  const handleInputClick = () => {
    setFillInputMode(true);
    if (selectedCoordinate) console.log(true);
  };

  const handleMapClick = () => {
    if (fillInputMode) {
      setInputValue(`${selectedCoordinate.lng}, ${selectedCoordinate.lat}`);
      setFillInputMode(false); // Turn off "click to fill" mode
    }
  };

  return (
    <div className="network-analysis-container">
      <h2>Network Analysis</h2>
      <div className="network-analysis">
        {features.map((feature) => (
          <div key={feature.id} className={`feature ${feature.isExpanded ? 'expanded' : ''}`}>
            <div
              className="feature-header"
              onClick={() => handleFeatureClick(feature.uniqueName)}
              title={feature.description}
            >
              <p>{feature.name}</p>
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="info-icon"
                onClick={() => handleInfoClick(feature.uniqueName)}
              />
            </div>
            {feature.isExpanded && (
              <div className="feature-content">
                <div className="input-group">
                  <label>Select {feature.name.split(' ')[3]}:</label>
                  <select>
                    {feature.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={() => handleApplyAnalysis(feature.uniqueName)}>
                  Apply Analysis
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NetworkAnalysis;
