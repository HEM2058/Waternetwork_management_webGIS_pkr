import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar'
import Filter from './Filter'
import LoginForm from './LoginForm'
import {Routes, Route} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Navbar />
    
          <Routes>
            <Route path="/Log-in" element = { <LoginForm/>} />   
          </Routes>

      {/* <Filter/> */}
    </div>
  );
}

export default App;
