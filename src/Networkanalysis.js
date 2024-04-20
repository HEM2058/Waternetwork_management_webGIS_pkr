import React, { useState, useEffect } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Elevation from './Elevation'; // Import the Elevation component

function NetworkAnalysis({ pipelineData, onRouteData, onOptimumRouteData, SelectedCoordinate }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState('driving');
  const [routeData, setRouteData] = useState(null);
  const [optimumRouteData, setoptimumRouteData] = useState(null);
  const [loadingElevation, setLoadingElevation] = useState(false);
  const [clickedTextArea, setClickedTextArea] = useState(null);
  const [elevationData, setElevationData] = useState(null); // State to store elevation data
  const [showElevationChart, setShowElevationChart] = useState(false); // State to track visibility of elevation chart
  const [manualAnalysisVisible, setManualAnalysisVisible] = useState(true); // State to track visibility of manual analysis
  const [automaticAnalysisVisible, setAutomaticAnalysisVisible] = useState(false); // State to track visibility of automatic analysis

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

      setLoadingElevation(true);

      const coordinates = routeData.data.data[0].latlngs.map(point => [point[0], point[1]]);
      const elevationApiUrl = 'http://127.0.0.1:8000/api/elevation/';
      const elevationResponse = await fetch(elevationApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates })
      });
       
      if (elevationResponse.ok) {
        const elevationData = await elevationResponse.json();
        setElevationData(elevationData); // Set elevation data to state
        setShowElevationChart(true); // Show elevation chart after fetching data
      } else {
        console.error(`Error fetching elevation data. Status: ${elevationResponse.status}`);
      }
    } catch (error) {
      console.error('Error in handleFindElevation:', error);
    } finally {
      setLoadingElevation(false);
    }
  };

  const handleCloseElevationChart = () => {
    setShowElevationChart(false); // Close elevation chart
  };

  const handleToggleManualAnalysis = () => {
    setManualAnalysisVisible(true);
    setAutomaticAnalysisVisible(false);
  };

  const handleToggleAutomaticAnalysis = () => {
    setManualAnalysisVisible(false);
    setAutomaticAnalysisVisible(true);
  };

  const handleFindMostOptimumRoute = async () => {
    try {
      if (destination.trim() === '') {
        console.error('Please enter the destination.');
        return;
      }

      const optimumRouteApiUrl = 'http://127.0.0.1:8000/api/OptimumRouteFinder/';
      const optimumRouteResponse = await fetch(optimumRouteApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ destination })
      });

      if (optimumRouteResponse.ok) {
        const optimumRouteData = await optimumRouteResponse.json();
        console.log(optimumRouteData)
        setoptimumRouteData(optimumRouteData);
        onOptimumRouteData(optimumRouteData);
      } else {
        console.error(`Error fetching optimum route data. Status: ${optimumRouteResponse.status}`);
      }
    } catch (error) {
      console.error('Error in handleFindMostOptimumRoute:', error);
    }
  };

  return (
    <div className="network-analysis-container">
      <h2>Pipeline Route Analysis</h2>
      <div className="analysis-buttons">
        <button onClick={handleToggleManualAnalysis} className={manualAnalysisVisible ? 'active-manual' : ''}>Manual Feasibility Analysis</button>
        <button onClick={handleToggleAutomaticAnalysis} className={automaticAnalysisVisible ? 'active-auto' : ''}>Auto Optimal Route Analysis</button>
      </div>
      {manualAnalysisVisible && (
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
              {loadingElevation && <div className="preloader"></div>}
              {showElevationChart && (
                <Elevation elevation_data={elevationData} onClose={handleCloseElevationChart} />
              )}
            </div>
          )}
        </div>
      )}
      {automaticAnalysisVisible && (
        <div className="automatic-analysis">
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
          <button className="find-route-button" onClick={handleFindMostOptimumRoute}>Find Most Optimum Route</button>
          {routeData && (
            <div className="result">
              <h3>Optimum Route Details</h3>
              <p>Pipe Length Required: {routeData.distance} meters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NetworkAnalysis;
