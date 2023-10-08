import React from 'react';
import './Navbar.css'; // You can create a CSS file for styling
import WavingFlag from './assets/WavingFlag.gif';
import logo from './assets/ddc-demo.png';
import Filter from './Filter';
import { Routes, Route, Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
        <Link to="/"><div className="logo1-container">
            <img src={WavingFlag} alt="WavingFlag" className="logo1" />
            <h2>Bajhang Digital Map</h2>
          </div></Link>
          
          <div className="logo2-container">
            <div className="horizontal-container">
              <Link to="/Log-in">Log in</Link>
            
              <img src={logo} alt="Logo" className="logo2" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
