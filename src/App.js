import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar'
import LoginForm from './LoginForm'
import OpenLayersMap from './map'
import MapComposite  from './mapcomposite';
import  LayerUploadForm from './shp_geojson';
import QuickAid from './QuickAid';
import Places from './Places'
import Relief from './Relief';
import PalikaDashboard from './PalikaDashboard';
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
            <Route path="/Places" element = {<Places/>}/>
            <Route path="/Relief" element = {<Relief/>}/>
            <Route path="/palika_dashboard" element = {<PalikaDashboard/>}/>
          </Routes>
      
   
    </div>
  );
}

export default App;
