import React from 'react';
import './Filter.css'; // You can create a CSS file for styling the Filter component

function Filter() {
  return (
    <div className="filter-container">
      <div className="filter">
        <label htmlFor="palikaSelect">Select palika</label>
        <select id="palikaSelect">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      </div>
      <div className="filter">
        <label htmlFor="wardSelect">Select ward</label>
        <select id="wardSelect">
          <option>Option A</option>
          <option>Option B</option>
          <option>Option C</option>
        </select>
      </div>
      <div className="filter">
        <label htmlFor="attributesSelect">Select attributes</label>
        <select id="attributesSelect">
          <option>Attribute X</option>
          <option>Attribute Y</option>
          <option>Attribute Z</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
