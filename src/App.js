import {useState,React} from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Networkanalysis from './Networkanalysis';
import Sidebar from './sidebar';
import MapComposite from './mapcomposite';
import Leakage from './Leakage';
import Edit from './Edit';
import OpenLayersMap from './map';
import ApiDataFetcher from './ApiDataFetcher';

function App() {
  const [apiData, setApiData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDataFetched = (data) => {
    setApiData(data);
    setIsDataLoaded(true);
  };
  
  const handleMapClick = (coordinate) => {
    setSelectedCoordinate(coordinate);
  };
  // Get the current route path
  const currentPath = location.pathname;

  // Function to dynamically render the component based on the current route
  const renderComponent = () => {
    switch (currentPath) {
      case '/Networkanalysis':
        return <Networkanalysis />;
      case '/Leakage':
        return <Leakage />;
        case '/Edit-pipeline':
          
        return <Edit />;
      default:
        // Handle unknown routes or redirect to the default route
        navigate('/');
        return null;
    }
  };

  return (
    <div className="App" >

      
           <Navbar />
      <Sidebar />
     
      <Routes>
        <Route path="/Networkanalysis" element={<Networkanalysis />} />
        <Route path="/Leakage" element={<Leakage />} />
        <Route path="/Edit-pipeline" element={<Edit />} />
      </Routes>

      <ApiDataFetcher onDataFetched={handleDataFetched} />
        {isDataLoaded ? <OpenLayersMap apiData={apiData} onMapClick={handleMapClick} /> : null}
  
    </div>
  );
}

export default App;
