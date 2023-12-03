import React, { useState } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function NetworkAnalysis({ selectedCoordinate}) {
  const [inputValue, setInputValue] = useState('');
  const [fillInputMode, setFillInputMode] = useState(false);
  console.log(selectedCoordinate)
  // onFillInputCallback(fillInputMode)
  const [features, setFeatures] = useState([
    {
      id: 1,
      uniqueName: 'shortestRouteReservoir',
      name: 'Shortest Route to Reservoir',
      description: 'Find the shortest route to the reservoir.',
      isExpanded: false,
    },
    {
      id: 2,
      uniqueName: 'shortestRouteTubeWell',
      name: 'Shortest Route to Tubewell',
      description: 'Find the shortest route to the tubewell.',
      isExpanded: false,
    },
    {
      id: 3,
      uniqueName: 'shortestRouteOverheadTank',
      name: 'Shortest Route to Overhead Tank',
      description: 'Find the shortest route to the overhead tank.',
      isExpanded: false,
    },
    {
      id: 4,
      uniqueName: 'shortestRouteBetweenPoints',
      name: 'Shortest Route Between Two Points',
      description: 'Find the shortest route between two points in the network.',
      isExpanded: false,
    },
  ]);

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
    if(selectedCoordinate )
    console.log(true)
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
                  <label>Input Coordinate:</label>
                  <input
                    type="text"
                    value={fillInputMode ? 'Click on the map' : inputValue}
                    onClick={handleInputClick}
                  />
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
