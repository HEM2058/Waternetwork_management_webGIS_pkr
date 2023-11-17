
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Places.css';

function Places() {
  const location = useLocation();
  const nepaliData = location.state ? location.state.nepaliData : null;
  const [palika, setPalika] = useState(nepaliData);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Fetch data from the API dynamically based on the selected palika
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:2500/api/Places/${palika}/`);
        if (response.ok) {
          const data = await response.json();
          setPlaces(data); // Assuming the API response is an array of places
          console.log(data);
        } else {
          console.error('Failed to fetch places:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching places:', error.message);
      }
    };

    fetchData();
  }, [palika]); // Trigger the effect whenever the selected palika changes

  const handlePalikaChange = (e) => {
    setPalika(e.target.value);
  };

  return (
    <div className='places-container'>
      <div className='header'>
        <select id="municipality-unique" value={palika} onChange={handlePalikaChange}>
          {/* Options for palika selection */}
          <option value="">All Palika</option>
          <option value="Bungal">बुङ्गल नगरपालिका</option>
          <option value="Bitthadchir">बित्थडचिर गाँउपालिका</option>
          <option value="Chhabispathibhera">छबिसपाथिभेरा गाँउपालिका</option>
          <option value="Durgathali">दुर्गाथली गाँउपालिका</option>
          <option value="Jayaprithvi">जयपृथ्वी नगरपालिका</option>
          <option value="Saipal">सइपाल गाउपालिका</option>
          <option value="Kedarsyun">केदारस्युँ गाँउपालिका</option>
          <option value="Khaptadchhanna">खप्तडछान्ना गाउँपालिका</option>
          <option value="Mastha">मष्टा गाउँपालिका</option>
          <option value="Surma">सूर्मा गाउँपालिका</option>
          <option value="Talakot">तलकोट गाँउपालिका</option>
          <option value="Thalara">थलारा गाउँपालिका</option>
        </select>
      </div>

      <div className='places-list'>
        {places.map((place, index) => (
          <div className='place-container' key={index}>
            <div className='place-title'>{place.place_title}</div>
            <div className='image-container'>
              <img src={place.place_image} alt='Place Image' />
            </div>
            <div className='place-control'>
              <button id='share'><i className="fas fa-share"></i></button>
              <button id='expand'><i className="fas fa-expand"></i></button>
            </div>
            <div className='place-description'>
              {place.place_description}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='pagination'>
        <button>&laquo; Prev</button>
        <span className='current-page'>1</span>
        <button>Next &raquo;</button>
      </div>
    </div>
  );
}

export default Places;
