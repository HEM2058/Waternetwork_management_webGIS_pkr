import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Networkanalysis from './Networkanalysis';
import Sidebar from './sidebar';
import Leakage from './Leakage';
import Edit from './Edit';
import OpenLayersMap from './map';
import Task from './Task';
import FieldCalculator from './FieldCalculator';
import ApiDataFetcher from './ApiDataFetcher';
import Intro from './Intro';
import ClientPage from './ClientPage';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pipelineData, setPipelineData] = useState([]);
  const [storageUnitData, setStorageUnitData] = useState([]);
  const [gateValveData, setGateValveData] = useState([]);
  const [tubeWellData, setTubeWellData] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedMultistringGeometry, setSelectedMultistringGeometry] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [taskGeometry, setTaskGeometry] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkIsAuthenticatedAdmin(token);
    }
  }, []);

  const checkIsAuthenticatedAdmin = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsDataLoaded(true); // Assuming isAdmin implies data loading
      } else {
        setIsDataLoaded(false);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsDataLoaded(false);
    }
  };

  const handleRouteData = (data) => {
    setRouteData(data);
  };

  const handleDataFetched = ({ pipelineData, storageUnitData, gateValveData, tubeWellData }) => {
    setPipelineData(pipelineData);
    setStorageUnitData(storageUnitData);
    setGateValveData(gateValveData);
    setTubeWellData(tubeWellData);
    setIsDataLoaded(true);
  };

  const handleMapClick = (coordinate) => {
    setSelectedCoordinate(coordinate);
  };

  const handleMultistringClick = (geometry) => {
    setSelectedMultistringGeometry(geometry);
  };

  const handleViewMap = (geometry) => {
    setTaskGeometry(geometry);
  };

  return (
    <div className="App">
      <Navbar />
      {isDataLoaded && (
        <React.Fragment>
          {localStorage.getItem('token') && <Sidebar />}
          <Routes>
            {localStorage.getItem('token') && <Route path="/" element={<Intro />} />}
            {localStorage.getItem('token') && (
              <Route
                path="/Networkanalysis"
                element={<Networkanalysis pipelineData={pipelineData} onRouteData={handleRouteData} SelectedCoordinate={selectedCoordinate} />}
              />
            )}
            {localStorage.getItem('token') && (
              <Route path="/task-splitting" element={<Task onViewMap={handleViewMap} />} />
            )}
            {localStorage.getItem('token') && <Route path="/Leakage" element={<Leakage />} />}
            {localStorage.getItem('token') && (
              <Route
                path="/Edit-pipeline"
                element={<Edit onMultistringClick={handleMultistringClick} />}
              />
            )}
            {localStorage.getItem('token') && (
              <Route path="/field-calculator" element={<FieldCalculator />} />
            )}
           
          </Routes>
        </React.Fragment>
       
      )}
      <Routes>
      {!localStorage.getItem('token') && <Route path="/" element={<ClientPage />} />}
      </Routes>
      
      {localStorage.getItem('token') &&<ApiDataFetcher onDataFetched={handleDataFetched} />}
      {localStorage.getItem('token') && isDataLoaded && (
        <OpenLayersMap
          pipelineData={pipelineData}
          storageUnitData={storageUnitData}
          gateValveData={gateValveData}
          tubeWellData={tubeWellData}
          onMapClick={handleMapClick}
          selectedMultistringGeometry={selectedMultistringGeometry}
          routeData={routeData}
          taskGeometry={taskGeometry}
        />
      )}
    </div>
  );
}

export default App;
