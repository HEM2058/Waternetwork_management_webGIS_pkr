import React, { useState, useEffect } from 'react';
import './NetworkAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function NetworkAnalysis({ pipelineData, onRouteData, SelectedCoordinate }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState('driving');
  const [routeData, setRouteData] = useState(null);
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

  return (
    <div className="network-analysis-container">
      <h2>Network Analysis</h2>
      <div className="network-analysis">
        <div className="input-group">
          <label>Enter Source:</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onClick={() => handleTextAreaClick('source')}
          />
        </div>
        <div className="input-group">
          <label>Enter Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onClick={() => handleTextAreaClick('destination')}
          />
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
            <p>Pipe Length: {routeData.data.data[0].distance} meters</p>
            <p>Total Duration: {routeData.data.data[0].duration} minutes</p>
          </div>
        )}
        <button onClick={handleApplyAnalysis}>Find Route</button>
      </div>
    </div>
  );
}

export default NetworkAnalysis;
