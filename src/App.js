import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar'
import LoginForm from './LoginForm'
import OpenLayersMap from './map'
import MapComposite  from './mapcomposite';
import  LayerUploadForm from './shp_geojson';
import PalikaDashboard from './PalikaDashboard';
import Requests from './Requests';
import Addplace from './Addplace';
import Networkanalysis from './Networkanalysis';
import {Routes, Route} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Navbar />
 
          <Routes>
            <Route path="/Log-in" element = { <LoginForm/>} />   
            <Route path="/" element = { <MapComposite/>} />  
            <Route path="/LayerUploadForm" element = { <LayerUploadForm/>} />  
            <Route path="/palika_dashboard" element = {<PalikaDashboard/>}/>
            <Route path="/palika_dashboard/requests" element= {<Requests/>}/>
            <Route path="/palika_dashboard/Add_Place" element= {<Addplace/>}/>
            <Route path="/Networkanalysis" element= {<Networkanalysis/>}/>

          </Routes>
      
   
    </div>
  );
}

export default App;
