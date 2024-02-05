import React, { useState, useEffect } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as turf from '@turf/turf';

function NetworkAnalysis({ apiData, onRouteData }) {
  const [inputValue, setInputValue] = useState('');
  const [fillInputMode, setFillInputMode] = useState(false);
  const [features, setFeatures] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  console.log(selectedOption);

  const handleOptionChange = (event) => {
    console.log(event);
    setSelectedOption(event.target.value);
  };

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getCurrentLocation();
    console.log(userLocation)
  }, []); // Run only once on component mount

  const handleApplyAnalysis = async (selectedName) => {
    try {
      // Encode the selected name
      const encodedName = encodeURIComponent(selectedName);
  
      // Construct the API URL for centroid
      const centroidApiUrl = `http://localhost:8000/api/centroid?selectedName=${encodedName}`;
      console.log(centroidApiUrl);
  
      // Make the API call to get the centroid
      const centroidResponse = await fetch(centroidApiUrl);
      
      if (centroidResponse.ok) {
        const centroidData = await centroidResponse.json();
        console.log('Centroid Data:', centroidData);
  
        // Extract the centroid coordinates
        const centroidCoordinates = extractCoordinates(centroidData.centroid);
  
        // Use the user's location stored in the state (userLocation)
        console.log('User Location:', userLocation);
  
        // Check if both the centroid and user's position are available
        if (centroidCoordinates && userLocation) {
          // Calculate the route using the routing API
          const routeApiUrl = `https://route-init.gallimap.com/api/v1/routing?mode=driving&srcLat=${userLocation.lat}&srcLng=${userLocation.lng}&dstLat=${centroidCoordinates.lat}&dstLng=${centroidCoordinates.lng}&accessToken=1b0d6442-4806-4a6c-90bb-5437128096eb`;
          console.log(routeApiUrl);
  
          // Make the API call to get the route
          const routeResponse = await fetch(routeApiUrl);
  
          if (routeResponse.ok) {
            const routeData = await routeResponse.json();
            console.log('Route Data:', routeData);
              // Pass the routeData to the callback function in App.js
              onRouteData(routeData);
  
            // Handle the route data as needed
          } else {
            console.error(`Error fetching route data. Status: ${routeResponse.status}`);
          }
        }
      } else {
        console.error(`Error fetching centroid data. Status: ${centroidResponse.status}`);
      }
    } catch (error) {
      console.error('Error in handleApplyAnalysis:', error);
    }
  };
  
  const extractCoordinates = (pointString) => {
    const matches = pointString.match(/\((-?\d+\.\d+) (-?\d+\.\d+)\)/);
    if (matches && matches.length === 3) {
      return { lat: parseFloat(matches[2]), lng: parseFloat(matches[1]) };
    }
    return null;
  };
  

  const handleInputClick = () => {
    setFillInputMode(true);
  };

  const handleMapClick = () => {
    if (fillInputMode) {
      setInputValue('Click on the map');
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
                  <select onChange={handleOptionChange} value={selectedOption}>
                    {feature.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={() => handleApplyAnalysis(selectedOption)}>
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
