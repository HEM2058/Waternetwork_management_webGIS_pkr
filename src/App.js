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
  const [isAdmin, setIsAdmin] = useState(false);
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
    const checkIsAuthenticatedAdmin = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/users/me/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage after login
          }
        });
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.is_superuser); // Assuming 'is_superuser' indicates admin status
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAdmin(false);
      }
    };

    checkIsAuthenticatedAdmin();
  }, []);

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
      {isAdmin && (
        <React.Fragment>
         
          <Sidebar />
        </React.Fragment>
      )}
      <Routes>
      {isAdmin && (
        <Route path="/" element={<Intro />} />
      )}
        {isAdmin && (
          <Route
            path="/Networkanalysis"
            element={<Networkanalysis pipelineData={pipelineData} onRouteData={handleRouteData} SelectedCoordinate={selectedCoordinate} />}
          />
        )}
        {isAdmin && (
          <Route path="/task-splitting" element={<Task onViewMap={handleViewMap} />} />
        )}
        {isAdmin && (
          <Route path="/Leakage" element={<Leakage />} />
        )}
        {isAdmin && (
          <Route
            path="/Edit-pipeline"
            element={<Edit onMultistringClick={handleMultistringClick} />}
          />
        )}
        {isAdmin && (
          <Route path="/field-calculator" element={<FieldCalculator />} />
        )}
        <Route path="/" element={<ClientPage />} />
      </Routes>

      <ApiDataFetcher onDataFetched={handleDataFetched} />
      {isAdmin && isDataLoaded && (
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
