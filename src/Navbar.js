import React from 'react';
import './Navbar.css'; // You can create a CSS file for styling
import WavingFlag from './assets/WavingFlag.gif';
import logo from './assets/ddc-demo.png';
import { Routes, Route, Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">
            <div className="logo1-container">
              <img src={WavingFlag} alt="WavingFlag" className="logo1" />
              <h2>Bajhang Digital Map</h2>
            </div>
          </Link>

          <div className="logo2-container">
            <div className="horizontal-container">
              {/* Relief Request Button */}
              <div className="icon-container" data-tooltip="Relief Request">
              <div className="relief-request-button">
                <Link to="/QuickAid" >
                  <i className="fas fa-hand-holding-heart"></i>
                </Link>
                </div>
              </div>

              {/* Municipality Login Button */}
              <div className="icon-container" data-tooltip="Municipality Login">
                <Link to="/Log-in" className="login-link">
                  <i className="fas fa-user"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
