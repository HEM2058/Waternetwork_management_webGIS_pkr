// QuickAid.js

import React from 'react';
import './QuickAid.css'; // Import the CSS file

const QuickAid = () => {
  return (
    <div className="quick-aid-form-unique">
      <div className="column-unique column-left-unique">
        <div className="form-section-unique">
          <label htmlFor="name-unique">Name</label>
          <input type="text" id="name-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="phone-unique">Phone</label>
          <input type="tel" id="phone-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="citizenship-unique">Citizenship No</label>
          <input type="text" id="citizenship-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="house-unique">House No</label>
          <input type="text" id="house-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="reliefFor-unique">Relief For</label>
          <select id="reliefFor-unique">
            <option value="food">Food</option>
            <option value="shelter">Shelter</option>
            <option value="medical">Medical Assistance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="file-section-unique">
        <label htmlFor="file-unique">Upload File</label>
        <input type="file" id="file-unique" />
      </div>
      </div>
      <div className="column-unique column-right-unique">
        <div className="form-section-unique">
          <label htmlFor="municipality-unique">Municipality</label>
          <input type="text" id="municipality-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="ward-unique">Ward</label>
          <input type="text" id="ward-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="location-unique">Location</label>
          <input type="text" id="location-unique" />
        </div>
        <div className="map-section-unique">
          <label htmlFor="map-unique">Map Location</label>
          <div id="map-unique" style={{ width: '100%', height: '300px' }}>
            {/* You can use JavaScript and a mapping library here to display the map */}
            {/* For example, you can use Google Maps or Leaflet */}
          </div>
        </div>
      </div>
     
      <button className="submit-button-unique">Submit</button>
    </div>
  );
};

export default QuickAid;
