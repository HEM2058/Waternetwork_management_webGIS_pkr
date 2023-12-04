import React, { useState } from 'react';
import './Edit.css';
import ApiDataFetcher from './ApiDataFetcher';

function Edit() {
  const [apiData, setApiData] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Callback function to handle data fetched by ApiDataFetcher
  const handleDataFetched = (data) => {
    setApiData(data[0]);
    setIsDataLoaded(true);
  };

  // Function to filter features by name
  const filterFeaturesByName = (features, name) => {
    return features.filter(feature => feature.properties.name === name);
  };

  return (
    <div className="edit-data-container ">
      <h2>Edit pipeline data</h2>
      <div className='editdata-feature-header'> <h3>ID</h3>
      <h3>Diameter</h3>
               </div>
      <div className="edit-data">
      
        {/* Pass the callback function to ApiDataFetcher */}
        <ApiDataFetcher onDataFetched={handleDataFetched} />

        {/* Check if data is loaded */}
        {isDataLoaded && apiData.geojson && apiData.geojson.features && apiData.geojson.features.length > 0 ? (
          
          <div className="feature-geojson">
            
           
            {filterFeaturesByName(apiData.geojson.features, 'waterpipe').map((feature, index) => (
             
              <div key={index} className="feature-geo">
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
