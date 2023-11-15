import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // You can create a CSS file for styling
import WavingFlag from './assets/WavingFlag.gif';
import logo from './assets/ddc-demo.png';

function Navbar() {
  const location = useLocation();
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
              <div
                className={`icon-container ${
                  location.pathname === '/places' ? 'active' : ''
                }`}
                data-tooltip="स्थानहरू"
              >
                <Link to="/places" >
                  <i className="fas fa-map-marker"></i> <span>Places</span>
                </Link>
              </div>

              <div
                className={`icon-container ${
                  location.pathname === '/Relief' || location.pathname === '/QuickAid' ? 'active' : ''
                }`}
                data-tooltip="राहत अनुरोध"
              >
                <Link to="/Relief" >
                  <i className="fas fa-paper-plane"></i> <span>Relief Request</span>
                </Link>
              </div>

              {/* Municipality Login Button */}
              <div
                className={`icon-container ${
                  location.pathname === '/Log-in' ? 'active' : ''
                }`}
                data-tooltip="पालिका लगइन"
              >
                <Link to="/Log-in" >
                  <i className="fas fa-sign-in-alt"></i><span> Palika Login</span>
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
