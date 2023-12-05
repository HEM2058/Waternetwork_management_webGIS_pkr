// Sidebar.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <NavLink
        to="/"
        exact
        className={`tool-icon ${location.pathname === '/' ? 'active' : ''}`}
        data-tooltip="Home"
        activeClassName="selected"
      >
        <i className="fas fa-home"></i>
      </NavLink>
      <NavLink
        to="/Networkanalysis"
        className={`tool-icon ${location.pathname === '/Networkanalysis' ? 'active' : ''}`}
        data-tooltip="Network Analysis"
        activeClassName="selected"
      >
        <i className="fas fa-network-wired"></i>
      </NavLink>
      <NavLink
        to="/task-splitting"
        className={`tool-icon ${location.pathname === '/task-splitting' ? 'active' : ''}`}
        data-tooltip="Task Control"
        activeClassName="selected"
      >
        <i className="fas fa-tasks"></i>
      </NavLink>
      <NavLink
        to="/Leakage"
        className={`tool-icon ${location.pathname === '/Leakage' ? 'active' : ''}`}
        data-tooltip="Leak Alerts"
        activeClassName="selected"
      >
        <i className="fas fa-exclamation-triangle"></i>
      </NavLink>
      <NavLink
        to="/edit-pipeline"
        className={`tool-icon ${location.pathname === '/edit-pipeline' ? 'active' : ''}`}
        data-tooltip="Edit Pipeline"
        activeClassName="selected"
      >
        <i className="fas fa-edit"></i>
      </NavLink>
      <NavLink
        to="/add-pipeline"
        className={`tool-icon ${location.pathname === '/add-pipeline' ? 'active' : ''}`}
        data-tooltip="Add Pipeline"
        activeClassName="selected"
      >
        <i className="fas fa-plus-circle"></i>
      </NavLink>
      <NavLink
        to="/field-calculator"
        className={`tool-icon ${location.pathname === '/field-calculator' ? 'active' : ''}`}
        data-tooltip="Field Calculator"
        activeClassName="selected"
      >
        <i className="fas fa-calculator"></i>
      </NavLink>
    </div>
  );
}

export default Sidebar;
