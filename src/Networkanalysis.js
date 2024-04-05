import React, { useState, useEffect } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function NetworkAnalysis({ pipelineData, onRouteData, SelectedCoordinate }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState('driving');
  const [routeData, setRouteData] = useState(null);
  const [loadingElevation, setLoadingElevation] = useState(false); // New state for loading elevation data
  const [clickedTextArea, setClickedTextArea] = useState(null);

  useEffect(() => {
    if (SelectedCoordinate && clickedTextArea) {
      const { lng, lat } = SelectedCoordinate;
      if (clickedTextArea === 'source') {
        setSource(`${lat},${lng}`);
      } else if (clickedTextArea === 'destination') {
        setDestination(`${lat},${lng}`);
      }
    }
  }, [SelectedCoordinate, clickedTextArea]);

  const handleModeChange = (event) => {
    setSelectedMode(event.target.value);
  };

  const handleTextAreaClick = (area) => {
    setClickedTextArea(area);
  };

  const handleApplyAnalysis = async () => {
    try {
      if (source.trim() === '' || destination.trim() === '') {
        console.error('Please enter both source and destination.');
        return;
      }

      const routeApiUrl = `https://route-init.gallimap.com/api/v1/routing?mode=${selectedMode}&srcLat=${source.split(',')[0]}&srcLng=${source.split(',')[1]}&dstLat=${destination.split(',')[0]}&dstLng=${destination.split(',')[1]}&accessToken=1b0d6442-4806-4a6c-90bb-5437128096eb`;
      const routeResponse = await fetch(routeApiUrl);

      if (routeResponse.ok) {
        const routeData = await routeResponse.json();
        setRouteData(routeData);
        onRouteData(routeData);
      } else {
        console.error(`Error fetching route data. Status: ${routeResponse.status}`);
      }
    } catch (error) {
      console.error('Error in handleApplyAnalysis:', error);
    }
  };

  const handleFindElevation = async () => {
    try {
      if (!routeData) {
        console.error('Route data not available.');
        return;
      }

      setLoadingElevation(true); // Set loading state to true when fetching elevation data

      // Extract coordinates from routeData
      const coordinates = routeData.data.data[0].latlngs.map(point => [point[0], point[1]]);
      
      // Send coordinates to the API to fetch elevation data
      const elevationApiUrl = 'http://127.0.0.1:8000/api/elevation/'; // Replace with your actual elevation API URL
      const elevationResponse = await fetch(elevationApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates })
      });
       
      if (elevationResponse.ok) {
        const elevationData = await elevationResponse.json();
        console.log('Elevation data:', elevationData);
        // Handle elevation data as needed
      } else {
        console.error(`Error fetching elevation data. Status: ${elevationResponse.status}`);
      }
    } catch (error) {
      console.error('Error in handleFindElevation:', error);
    } finally {
      setLoadingElevation(false); // Set loading state to false after fetching elevation data
    }
  };

  return (
    <div className="network-analysis-container">
      <h2>Network Analysis</h2>
      <div className="network-analysis">
        <div className="input-group">
          <label>Enter Source Pipeline:</label>
          <input
            className="text-input"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onClick={() => handleTextAreaClick('source')}
          />
        </div>
        <div className="input-group">
          <label>Enter Destination:</label>
          <input
            className="text-input"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onClick={() => handleTextAreaClick('destination')}
          />
        </div>
        <button className="find-route-button" onClick={handleApplyAnalysis}>Find Route</button>
        {routeData && (
          <div className="result">
            <h3>Route Details</h3>
            <p>Pipe Length Required: {routeData.data.data[0].distance} meters</p>
            <button className="find-elevation-button" onClick={handleFindElevation}>Find Elevation</button>
            {loadingElevation && <div className="preloader"></div>} {/* Render preloader animation while loading elevation */}
          </div>
        )}
      </div>
    </div>
  );
}

export default NetworkAnalysis;
