import React from 'react';
import './PropertyViewer.css';

function PropertyViewer({ properties, closePopup }) {
  if (!properties || Object.keys(properties).length === 0) {
    return null; // Don't render anything if properties are not provided or empty
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <span className="close-button" onClick={closePopup}>&times;</span>
        <h2>Property Viewer</h2>
        <ul>
          {Object.keys(properties).map((propertyName) => {
            if (properties[propertyName] !== null) {
              return (
                <li key={propertyName}>
                  <strong>{propertyName}:</strong> {properties[propertyName]}
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
}

export default PropertyViewer;
