import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar'
import Filter from './Filter'
import LoginForm from './LoginForm'
import OpenLayersMap from './map'
import {Routes, Route} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Navbar />
          <Routes>
            <Route path="/Log-in" element = { <LoginForm/>} />   
          </Routes>
          <OpenLayersMap/>
      {/* <Filter/> */}
    </div>
  );
}

export default App;
