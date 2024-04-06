import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Networkanalysis from './Networkanalysis';
import Sidebar from './sidebar';
import MapComposite from './mapcomposite';
import Leakage from './Leakage';
import Edit from './Edit';
import OpenLayersMap from './map';
import Task from './Task';
import FieldCalculator from './FieldCalculator';
import ApiDataFetcher from './ApiDataFetcher';
import Intro from './Intro';
function App() {
  const [pipelineData, setPipelineData] = useState([]);
  const [storageUnitData, setStorageUnitData] = useState([]);
  const [gateValveData, setGateValveData] = useState([]);
  const [tubeWellData, setTubeWellData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedMultistringGeometry, setSelectedMultistringGeometry] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [taskGeometry, setTaskGeometry] = useState(null); // State to store task geometry

  const navigate = useNavigate();
  const location = useLocation();
  console.log(routeData)

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
    // Set the selected multistring geometry
    setSelectedMultistringGeometry(geometry);
  };

  const handleViewMap = (geometry) => {
    // Set the task geometry
    setTaskGeometry(geometry);
  };


  const currentPath = location.pathname;


  return (
    <div className="App">
      <Navbar />
      <Sidebar />
      <Routes>
      <Route path="/" element={<Intro />} />
        <Route
          path="/Networkanalysis"
          element={<Networkanalysis pipelineData={pipelineData} onRouteData={handleRouteData} SelectedCoordinate={selectedCoordinate}  />}
        />
        <Route path="/task-splitting" element={<Task onViewMap={handleViewMap} />} />
        <Route path="/Leakage" element={<Leakage />} />
        <Route
          path="/Edit-pipeline"
          element={<Edit onMultistringClick={handleMultistringClick} />}
        />
        <Route path="/field-calculator" element={<FieldCalculator />} />
      </Routes>

      <ApiDataFetcher onDataFetched={handleDataFetched} />
      {isDataLoaded ? (
        <OpenLayersMap
          pipelineData={pipelineData}
          storageUnitData={storageUnitData}
          gateValveData={gateValveData}
          tubeWellData={tubeWellData}
          onMapClick={handleMapClick}
          selectedMultistringGeometry={selectedMultistringGeometry}
          routeData={routeData}
          taskGeometry={taskGeometry} // Pass task geometry to OpenLayersMap
          
        />
      ) : null}
    </div>
  );
}

export default App;
