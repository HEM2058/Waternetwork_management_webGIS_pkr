import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar'
import LoginForm from './LoginForm'
import OpenLayersMap from './map'
import MapComposite  from './mapcomposite';
import  LayerUploadForm from './shp_geojson'
import QuickAid from './QuickAid'
import {Routes, Route} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Navbar />
 
          <Routes>
            <Route path="/Log-in" element = { <LoginForm/>} />   
            <Route path="/" element = { <MapComposite/>} />  
            <Route path="/LayerUploadForm" element = { <LayerUploadForm/>} />  
            <Route path="/QuickAid" element = { <QuickAid/>} /> 
          </Routes>
      
   
    </div>
  );
}

export default App;
