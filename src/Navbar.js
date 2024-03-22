import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // You can create a CSS file for styling
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
                <h2>AquaMapper</h2>
                <div className='sub-title'>
                <p>Pokhara's Water Distribution Management system</p>
                <div className='border-bottom'></div>
                </div>
            
             
            </div>
          </Link>
          <div className="logo2-container">
  <div className="horizontal-container">
      {/* Notification Icon */}
      <div
      className={`icon-container ${
        location.pathname === '/notifications' ? 'active' : ''
      }`}
      data-tooltip="Notifications"
    >
      <Link to="/notifications">
        <i className="fas fa-bell"></i><span className='noti-count'>5</span> 
      </Link>
    </div>
    {/* Profile Icon */}
    <div
      className={`icon-container ${
        location.pathname === '/profile' ? 'active' : ''
      }`}
      data-tooltip="Profile"
    >
      <Link to="/profile">
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
