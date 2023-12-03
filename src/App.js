import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Networkanalysis from './Networkanalysis';
import Sidebar from './sidebar';
import MapComposite from './mapcomposite';
import Leakage from './Leakage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current route path
  const currentPath = location.pathname;

  // Function to dynamically render the component based on the current route
  const renderComponent = () => {
    switch (currentPath) {
      case '/Networkanalysis':
        return <Networkanalysis />;
      case '/Leakage':
        return <Leakage />;
      default:
        // Handle unknown routes or redirect to the default route
        navigate('/');
        return null;
    }
  };

  return (
    <div className="App" style={{ position: 'relative' }}>

      
            <Navbar />
      <Sidebar />
     
      <Routes>
        <Route path="/Networkanalysis" element={<Networkanalysis />} />
        <Route path="/Leakage" element={<Leakage />} />
      </Routes>

        <MapComposite />
  
    </div>
  );
}

export default App;
