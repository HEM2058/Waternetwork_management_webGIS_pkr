// MunicipalityInfo.js
import React, { useState } from 'react';
import './MunicipalityInfo.css'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Places from './Places';

function MunicipalityInfo({ data }) {
  const [palikaname, setPalikaname] = useState('');
  const navigate = useNavigate ();
console.log(navigate)
  const handlePlacesClick = () => {
    // Redirect to the '/places' route and pass data.nepali as a prop
    console.log(data.NEPALI_NAME)
    navigate('/places',{state: { nepaliData: data.LOCAL}});
    
  };

  return (
    <div className="map_popup">
      <div className="map_popup__title">{data.NEPALI_NAME}</div>
      <div className="map_popup__content">
        <strong>{data.LOCAL}</strong> ({data.TYPE})
        <div className="map_popup__btn-row">
       <a className="map_popup__btn" href={data.WEBSITE} target="_blank">
            WEBSITE <i className="fas fa-arrow-right arrow-animation"></i>
          </a>
       
          <button className="map_popup__btn" onClick={handlePlacesClick}>
            PLACES <i className="fas fa-arrow-right arrow-animation"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MunicipalityInfo;
