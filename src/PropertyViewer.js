import React, { useState, useEffect } from 'react';
import './PropertyViewer.css';

function PropertyViewer({ properties }) {
  const [isOpen, setIsOpen] = useState(properties && Object.keys(properties).length > 0);

  useEffect(() => {
    setIsOpen(properties && Object.keys(properties).length > 0);
  }, [properties]);

  const handlePopupClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <span className="close-button" onClick={handlePopupClose}>&times;</span>
        <h2>Attributes</h2>
        <div className="content-scroll">
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
    </div>
  );
}

export default PropertyViewer;
