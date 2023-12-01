import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // You can create a CSS file for styling
import WavingFlag from './assets/WavingFlag.gif';
import logo from './assets/ddc-demo.png';

function Navbar() {
  const location = useLocation();

  // Check if the user token is present in localStorage
  const userToken = localStorage.getItem('authToken');
  const isLoggedIn = userToken !== null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">
            <div className="logo1-container">
              <img src={WavingFlag} alt="WavingFlag" className="logo1" />
              <h2>Pokhara Metro Web GIS based Water Pipeline Management System</h2>
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
                <Link to="/places">
                  <i className="fas fa-database"></i> <span>Database</span>
                </Link>
              </div>

         

              {/* Render Palika Dashboard or Palika Login based on login status */}
              {isLoggedIn ? (
                <div
                  className={`icon-container ${
                    location.pathname === '/palika_dashboard' ||location.pathname === '/palika_dashboard/requests'||location.pathname === '/palika_dashboard/add_place' ? 'active' : ''
                  }`}
                  data-tooltip="पालिका ड्यासबोर्ड"
                >
                  <Link to="/palika_dashboard">
                    <i className="fas fa-tachometer-alt"></i><span> Palika Dashboard</span>
                  </Link>
                </div>
              ) : (
                <div
                  className={`icon-container ${
                    location.pathname === '/Log-in' ? 'active' : ''
                  }`}
                  data-tooltip="पालिका लगइन"
                >
                  <Link to="/Log-in">
                    <i className="fas fa-sign-in-alt"></i><span> Metro Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
