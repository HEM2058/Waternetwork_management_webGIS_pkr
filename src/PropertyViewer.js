import React, { useState, useEffect } from 'react';
import './PropertyViewer.css';

function PropertyViewer({ properties, setClosePopup, onClosePopup }) {
  const [isOpen, setIsOpen] = useState(properties && Object.keys(properties).length > 0);
console.log(setClosePopup)
  useEffect(() => {
    setIsOpen(properties && Object.keys(properties).length > 0);
  }, [properties]);

  // Check if setClosePopup has a true value, and trigger the handlePopupClose function if it does
  useEffect(() => {
    if (setClosePopup === true) {
      handlePopupClose();
      onClosePopup(); // Call the onClosePopup function in the parent component
    }
  }, [setClosePopup]);

  if (!isOpen) {
    return null;
  }

  const handlePopupClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
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
