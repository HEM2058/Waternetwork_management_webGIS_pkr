import React, { useState } from 'react';
import axios from 'axios';
import './QuickAid.css';
import OpenLayersMap from './map';

const QuickAid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [citizenship_no, setCitizenship_no] = useState('');
  const [house_no, setHouse_no] = useState('');
  const [disaster, setDisaster] = useState('');
  const [img, setImg] = useState(null);
  const [palika, setPalika] = useState('');
  const [ward, setWard] = useState('');
  const [coordinate, setCoordinates] = useState('');

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const LC = `${latitude},${longitude}`;
        setLocation(LC);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }, (error) => {
        console.error(`Geolocation error: ${error.message}`);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleCitizenship_noChange = (e) => {
    setCitizenship_no(e.target.value);
  };

  const handleHouse_noChange = (e) => {
    setHouse_no(e.target.value);
  };

  const handleDisasterChange = (e) => {
    setDisaster(e.target.value);
  };

  const handlePalikaChange = (e) => {
    setPalika(e.target.value);
    console.log(palika)
  };

  const handleWardChange = (e) => {
    setWard(e.target.value);
  };

  const handleCoordinateChange = (e) => {
    setCoordinates(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('palika', palika); // Use the state value directly
      formData.append('ward', ward);
      formData.append('location', coordinate);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('citizenship_no', citizenship_no);
      formData.append('House_no', house_no);
      formData.append('disaster', disaster); // Use the state value directly
      formData.append('img', img);
  
      console.log(formData);
  
      const response = await axios.post('http://127.0.0.1:2500/relief_request', formData);
  
      console.log('Response from the server:', response.data);
  
      // You can also redirect to a success page or perform other actions based on the response
    } catch (error) {
      console.error('Error sending request:', error.message);
    }
  };
  

  return (
    <div className="quick-aid-form-unique">
      {currentPage === 1 && (
        <div className="column-unique column-left-unique">
          <h1 className="quick-aid-heading">राहत सहयोगको लागि अनुरोध- पृष्ठ 1</h1>
          <div className="form-section-unique">
            <label htmlFor="name-unique">नाम (Name)*</label>
            <input type="text" id="name-unique" value={name} onChange={handleNameChange} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="phone-unique"> फोन (Phone) *</label>
            <input type="tel" id="phone-unique" value={phone} onChange={handlePhoneChange} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="citizenship-unique">नागरिकता नं (Citizenship No ) *</label>
            <input type="text" id="citizenship-unique" value={citizenship_no} onChange={handleCitizenship_noChange} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="house-unique">घर नं (House No)*</label>
            <input type="text" id="house-unique" value={house_no} onChange={handleHouse_noChange} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="reliefFrom-unique">सहायता बाट (Relief From Disaster) *</label>
            <select id="reliefFrom-unique" value={disaster} onChange={handleDisasterChange}>
              <option value="earthquake">भूकम्प (Earthquake ) </option>
              {/* ... Other options ... (अन्य विकल्पहरू) */}
            </select>
          </div>
          <div className="form-section-unique">
            <label htmlFor="file-unique">तस्वीर अपलोड गर्नुहोस् (Upload Image) *</label>
            <input type="file" id="file-unique" onChange={handleImgChange} />
            <p className="note-text">
              कृपया तपाईंको सम्पत्ति वा घरमा, प्रकोपको प्रभावको तस्वीर अपलोड गर्नुहोस्
            </p>
          </div>
          <button type="button" onClick={nextPage}>
            Next
          </button>
        </div>
      )}

      {currentPage === 2 && (
        <div className="column-unique column-right-unique">
          <h1 className="quick-aid-heading">राहत सहयोगको लागि अनुरोध- पृष्ठ 2 </h1>
          <div className="form-section-unique">
            <label htmlFor="municipality-unique">पालिका चयन गर्नुहोस् (Select a palika) *</label>
            <select id="municipality-unique" value={palika} onChange={handlePalikaChange}>
        
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
          <div className="form-section-unique">
            <label htmlFor="ward-unique">Ward (वार्ड) *</label>
            <input type="text" id="ward-unique" value={ward} onChange={handleWardChange} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="location-unique">Location (स्थान) *</label>
            <div className="location-input-wrapper">
              <input type="text" id="location-unique" value={location} onChange={handleCoordinateChange} />
              <button type="button" className="location-icon" onClick={getCurrentLocation}>
                <i className="fas fa-map-marker-alt"></i>
              </button>
            </div>
          </div>
          <div id="map-unique">
            <OpenLayersMap location={location} />
          </div>
          <button type="button" onClick={prevPage}>
            Back
          </button>
          <button className="submit-button-unique" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickAid;
