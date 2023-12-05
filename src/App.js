import { useState, React } from 'react';
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

function App() {
  const [apiData, setApiData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedMultistringGeometry, setSelectedMultistringGeometry] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDataFetched = (data) => {
    setApiData(data);
    setIsDataLoaded(true);
  };

  const handleMapClick = (coordinate) => {
    setSelectedCoordinate(coordinate);
  };

  const handleMultistringClick = (geometry) => {
    // Set the selected multistring geometry
    setSelectedMultistringGeometry(geometry);
  };

  const currentPath = location.pathname;

  const renderComponent = () => {
    switch (currentPath) {
      case '/Networkanalysis':
        return <Networkanalysis />;
        case '/task-splitting':
          return <Task />;
      case '/Leakage':
        return <Leakage />;
      case '/Edit-pipeline':
        return <Edit onMultistringClick={handleMultistringClick} />;
        case '/field-calculator':
          return <FieldCalculator />;
      default:
        navigate('/');
        return null;
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Sidebar />

      <Routes>
        <Route path="/Networkanalysis" element={<Networkanalysis />} />
        <Route path="/task-splitting" element={<Task />} />
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
          apiData={apiData}
          onMapClick={handleMapClick}
          selectedMultistringGeometry={selectedMultistringGeometry}
        />
      ) : null}
    </div>
  );
}

export default App;
