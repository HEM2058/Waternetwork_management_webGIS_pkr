// QuickAid.js

import React from 'react';
import './QuickAid.css'; // Import the CSS file
import OpenLayersMap from './map';
const QuickAid = () => {
  return (
    <div className="quick-aid-form-unique">
      <div className="column-unique column-left-unique">
      <h1 className="quick-aid-heading">Request for Relief Assistance</h1> {/* Added heading here */}
        <div className="form-section-unique">
          <label htmlFor="name-unique">Name *</label> {/* Added asterisk (*) to denote mandatory field */}
          <input type="text" id="name-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="phone-unique">Phone *</label> {/* Added asterisk (*) to denote mandatory field */}
          <input type="tel" id="phone-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="citizenship-unique">Citizenship No *</label>
          <input type="text" id="citizenship-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="house-unique">House No *</label>
          <input type="text" id="house-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="reliefFrom-unique">Relief From *</label> {/* Updated the label */}
          <select id="reliefFrom-unique">
          <option value="earthquake">Earthquake</option>
           <option value="flood">Flood</option>
           <option value="landslide">Landslide</option>
           <option value="avalanche">Avalanche</option>
           <option value="monsoon-flooding">Monsoon Flooding</option>
           <option value="forest-fire">Forest Fire</option>
           <option value="drought">Drought</option>
           <option value="glacial-lake-outburst-flood">Glacial Lake Outburst Flood (GLOF)</option>
           <option value="epidemic">Epidemic</option>
           <option value="cyclone">Cyclone</option>
           <option value="cold-wave">Cold Wave</option>
           <option value="heat-wave">Heat Wave</option>
          </select>
        </div>
        <div className="form-section-unique">
          <label htmlFor="file-unique">Upload Image *</label>
          <input type="file" id="file-unique" />
          <p className="note-text">
            Please upload an image to document the disaster's impact, such as a landslide effect on your home.
          </p>
        </div>
      </div>
      <div className="column-unique column-right-unique">
        <div className="form-section-unique">
          <label htmlFor="municipality-unique">Municipality *</label>
          <input type="text" id="municipality-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="ward-unique">Ward *</label>
          <input type="text" id="ward-unique" />
        </div>
        <div className="form-section-unique">
          <label htmlFor="location-unique">Location *</label>
          <input type="text" id="location-unique" />
        </div>
       
          
          <div id="map-unique" >
           <OpenLayersMap/>
          </div>
      
      </div>
      <button className="submit-button-unique">Submit</button>
    </div>
  );
};

export default QuickAid;
