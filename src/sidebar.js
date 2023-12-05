// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
         <NavLink
        to="/"
        exact
        className="tool-icon"
        data-tooltip="Home"
        activeClassName="selected"
      >
        <i className="fas fa-home"></i>
      </NavLink>
      <NavLink
        to="/Networkanalysis"
        className="tool-icon"
        data-tooltip="Network Analysis"
        activeClassName="selected"
      >
        <i className="fas fa-network-wired"></i>
      </NavLink>
      <NavLink
        to="/task-splitting"
        className="tool-icon"
        data-tooltip="Task Control"
        activeClassName="selected"
      >
        <i className="fas fa-tasks"></i>
      </NavLink>
      <NavLink
        to="/Leakage"
        className="tool-icon"
        data-tooltip="Leak Alerts"
        activeClassName="selected"
      >
        <i className="fas fa-exclamation-triangle"></i>
      </NavLink>
      <NavLink
        to="/edit-pipeline"
        className="tool-icon"
        data-tooltip="Edit Pipeline"
        activeClassName="selected"
      >
        <i className="fas fa-edit"></i>
      </NavLink>
      <NavLink
        to="/add-pipeline"
        className="tool-icon"
        data-tooltip="Add Pipeline"
        activeClassName="selected"
      >
        <i className="fas fa-plus-circle"></i>
      </NavLink>
      <NavLink
        to="/field-calculator"
        className="tool-icon"
        data-tooltip="Field Calculator"
        activeClassName="selected"
      >
        <i className="fas fa-calculator"></i>
      </NavLink>
    </div>
  );
}

export default Sidebar;
