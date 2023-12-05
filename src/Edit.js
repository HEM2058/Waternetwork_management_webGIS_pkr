import React, { useState } from 'react';
import './Edit.css';
import ApiDataFetcher from './ApiDataFetcher';

function Edit({ onMultistringClick }) {
  const [apiData, setApiData] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedFeature,setSelectedFeature] = useState(null);

  // Callback function to handle data fetched by ApiDataFetcher
  const handleDataFetched = (data) => {
    setApiData(data[0]);
    setIsDataLoaded(true);
  };

  // Function to filter features by name
  const filterFeaturesByName = (features, name) => {
    return features.filter(feature => feature.properties.name === name);
  };

  // Function to handle click inside the feature-geo container
  const handleFeatureClick = (featureGeometry) => {
    // Call the callback function to send the clicked multistring feature geometry
    onMultistringClick(featureGeometry);
    setSelectedFeature(featureGeometry);
  };

  return (
    <div className="edit-data-container ">
      <h2>Edit pipeline data</h2>
      <div className='editdata-feature-header'> 
        <h3>ID</h3>
        <h3>Diameter</h3>
      </div>
      <div className="edit-data">
        {/* Pass the callback function to ApiDataFetcher */}
        <ApiDataFetcher onDataFetched={handleDataFetched} />

        {/* Check if data is loaded */}
        {isDataLoaded && apiData.geojson && apiData.geojson.features && apiData.geojson.features.length > 0 ? (
          <div className="feature-geojson">
            {filterFeaturesByName(apiData.geojson.features, 'waterpipe').map((feature, index) => (
              // Attach the click event handler to the feature-geo container
              <div
                key={index}
                className={`feature-geo ${selectedFeature === feature.geometry ? 'selected' : ''}`}
                style={{ backgroundColor: selectedFeature === feature.geometry ? 'red' : 'initial' }}
                onClick={() => handleFeatureClick(feature.geometry)}
              >
                <div className="column">
                  <div>{index}</div>
                </div>
                <div className="column">
                  <div className='diameter'>{feature.properties.diameter || ''}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}

export default Edit;
