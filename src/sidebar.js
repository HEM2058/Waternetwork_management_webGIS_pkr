import React, { useState } from 'react';
import './sidebar.css';

function Sidebar() {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
  };

  const isToolSelected = (tool) => tool === selectedTool;

  return (
    <div className="sidebar">
      <div
        className={`tool-icon ${isToolSelected('Network Analysis') && 'selected'}`}
        data-tooltip="Network Analysis"
        onClick={() => handleToolClick('Network Analysis')}
      >
        <i className="fas fa-network-wired"></i>
      </div>
      <div
        className={`tool-icon ${isToolSelected('Task Splitting') && 'selected'}`}
        data-tooltip="Task Splitting"
        onClick={() => handleToolClick('Task Splitting')}
      >
        <i className="fas fa-tasks"></i>
      </div>
      <div
        className={`tool-icon ${isToolSelected('Pipe Leakage Message') && 'selected'}`}
        data-tooltip="Pipe Linkage Message"
        onClick={() => handleToolClick('Pipe Leakage Message')}
      >
        <i className="fas fa-exclamation-triangle"></i>
      </div>
      <div
        className={`tool-icon ${isToolSelected('Edit Pipeline') && 'selected'}`}
        data-tooltip="Edit Pipeline"
        onClick={() => handleToolClick('Edit Pipeline')}
      >
        <i className="fas fa-edit"></i>
      </div>
      <div
        className={`tool-icon ${isToolSelected('Add Pipeline') && 'selected'}`}
        data-tooltip="Add Pipeline"
        onClick={() => handleToolClick('Add Pipeline')}
      >
        <i className="fas fa-plus-circle"></i>
      </div>
      <div
        className={`tool-icon ${isToolSelected('Field Calculator') && 'selected'}`}
        data-tooltip="Field Calculator"
        onClick={() => handleToolClick('Field Calculator')}
      >
        <i className="fas fa-calculator"></i>
      </div>
    </div>
  );
}

export default Sidebar;
