// MunicipalityInfo.js
import React from 'react';
import './MunicipalityInfo.css'

function MunicipalityInfo({ data }) {
   
  return (
    <div className="map_popup">
      <div className="map_popup__title">{data.NEPALI_NAME}</div>
      <div className="map_popup__content">
        <strong>{data.LOCAL}</strong> ({data.TYPE})
        <div className="map_popup__btn-row">
        <a className="map_popup__btn" href={data.WEBSITE} target="_blank">
            
        WEBSITE <i className="fas fa-arrow-right arrow-animation"></i>
          
          </a>
          
          <a className="map_popup__btn" href={data.WEBSITE} target="_blank">
            
            PLACES <i className="fas fa-arrow-right arrow-animation"></i>
              
              </a>
        </div>
      </div>
      
    </div>
  );
  
}

export default MunicipalityInfo;
