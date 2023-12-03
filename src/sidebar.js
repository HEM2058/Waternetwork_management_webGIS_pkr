// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import './sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink
        to="/Networkanalysis"
        activeClassName="selected" // Use activeClassName for active styling
        className="tool-icon"
        data-tooltip="Network Analysis"
      >
        <i className="fas fa-network-wired"></i>
      </NavLink>
      <NavLink
        to="/task-splitting"
        activeClassName="selected"
        className="tool-icon"
        data-tooltip="Task Splitting"
      >
        <i className="fas fa-tasks"></i>
      </NavLink>
      <NavLink
        to="/Leakage"
        activeClassName="selected"
        className="tool-icon"
        data-tooltip="Pipe Leakage Message"
      >
        <i className="fas fa-exclamation-triangle"></i>
      </NavLink>
      <NavLink
        to="/edit-pipeline"
        activeClassName="selected"
        className="tool-icon"
        data-tooltip="Edit Pipeline"
      >
        <i className="fas fa-edit"></i>
      </NavLink>
      <NavLink
        to="/add-pipeline"
        activeClassName="selected"
        className="tool-icon"
        data-tooltip="Add Pipeline"
      >
        <i className="fas fa-plus-circle"></i>
      </NavLink>
      <NavLink
        to="/field-calculator"
        activeClassName="selected"
        className="tool-icon"
        data-tooltip="Field Calculator"
      >
        <i className="fas fa-calculator"></i>
      </NavLink>
    </div>
  );
}

export default Sidebar;
