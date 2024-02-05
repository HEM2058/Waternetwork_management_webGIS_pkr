import React, { useState, useEffect } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function NetworkAnalysis({ apiData, onRouteData }) {
  const [features, setFeatures] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedMode, setSelectedMode] = useState('driving');
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
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
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleModeChange = (event) => {
    setSelectedMode(event.target.value);
  };

  const handleApplyAnalysis = async (selectedName) => {
    try {
      const encodedName = encodeURIComponent(selectedName);
      const centroidApiUrl = `http://localhost:8000/api/centroid?selectedName=${encodedName}`;
      const centroidResponse = await fetch(centroidApiUrl);

      if (centroidResponse.ok) {
        const centroidData = await centroidResponse.json();
        const centroidCoordinates = extractCoordinates(centroidData.centroid);

        if (centroidCoordinates && userLocation) {
          const routeApiUrl = `https://route-init.gallimap.com/api/v1/routing?mode=${selectedMode}&srcLat=${userLocation.lat}&srcLng=${userLocation.lng}&dstLat=${centroidCoordinates.lat}&dstLng=${centroidCoordinates.lng}&accessToken=1b0d6442-4806-4a6c-90bb-5437128096eb`;
          const routeResponse = await fetch(routeApiUrl);

          if (routeResponse.ok) {
            const routeData = await routeResponse.json();
            setRouteData(routeData);
            onRouteData(routeData);
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
                <div className="input-group">
                  <label>Select Mode:</label>
                  <select onChange={handleModeChange} value={selectedMode}>
                    <option value="driving">Driving</option>
                    <option value="walking">Walking</option>
                    <option value="cycling">Cycling</option>
                  </select>
                </div>
                {routeData && (
          <div className="result">
            <h3>Route Details</h3>
            <p>Total Distance: {routeData.data.data[0].distance} meters</p>
            <p>Total Duration: {routeData.data.data[0].duration} minutes</p>
          </div>
        )}
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
