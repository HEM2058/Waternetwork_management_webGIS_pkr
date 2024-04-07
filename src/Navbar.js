import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // You can create a CSS file for styling
import logo from './assets/ddc-demo.png';
import Login from './Login'; // Import the Login component

function Navbar() {
  const location = useLocation();
  const [isLoginVisible, setIsLoginVisible] = useState(false); // State to manage the visibility of the login component

  // Function to toggle the visibility of the login component
  const toggleLogin = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  // Check if the user token is present in localStorage
  const userToken = localStorage.getItem('authToken');
  const isLoggedIn = userToken !== null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">
            <div className="logo1-container">
              <h2>AquaMapper(PWDMS)</h2>
              <div className='sub-title'>
                <p>Pokhara Water Distribution Management system</p>
                <div className='border-bottom'></div>
              </div>
            </div>
          </Link>
          <div className="logo2-container">
            <div className="horizontal-container">
              {/* Profile Icon */}
              <div
                className={`icon-container ${
                  location.pathname === '/profile' ? 'active' : ''
                }`}
                data-tooltip="Profile"
              >
                <i className="fas fa-user" onClick={toggleLogin}></i> {/* Add onClick handler to toggle login */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoginVisible && (
        <div className="login-popup">
          <Login />
          <button onClick={toggleLogin}>Close</button> {/* Close button for the popup */}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
