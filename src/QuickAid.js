import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './QuickAid.css';
import OpenLayersMap from './map';

const QuickAid = () => {
  const [hidepopup, setHidepopup] = useState(true);
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
  const [coordinate, setCoordinate] = useState('');

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const LC = `${latitude},${longitude}`;
          setLocation(LC);
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error(`Geolocation error: ${error.message}`);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('palika', palika);
      formData.append('ward', ward);
      formData.append('location', location);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('citizenship_no', citizenship_no);
      formData.append('House_no', house_no);
      formData.append('disaster', disaster);
      formData.append('img', img);

      console.log(formData);

      const response = await axios.post('http://127.0.0.1:2500/api/relief_request', formData);

      console.log('Response from the server:', response.data);

      // Display sweet alert based on the response
      Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Your relief request has been successfully submitted!',
      });

      // You can also redirect to a success page or perform other actions based on the response
    } catch (error) {
      console.error('Error sending request:', error.message);

      // Display error sweet alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit the request. Please try again later.',
      });
    }
  };

  return (
    <div className="quick-aid-form-unique">
      {currentPage === 1 && (
        <div className="column-unique column-left-unique">
          <h1 className="quick-aid-heading">राहत सहयोगको लागि अनुरोध- पृष्ठ 1</h1>
          <div className="form-section-unique">
            <label htmlFor="name-unique">नाम (Name)*</label>
            <input type="text" id="name-unique" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="phone-unique"> फोन (Phone) *</label>
            <input type="tel" id="phone-unique" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="citizenship-unique">नागरिकता नं (Citizenship No ) *</label>
            <input type="text" id="citizenship-unique" value={citizenship_no} onChange={(e) => setCitizenship_no(e.target.value)} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="house-unique">घर नं (House No)*</label>
            <input type="text" id="house-unique" value={house_no} onChange={(e) => setHouse_no(e.target.value)} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="reliefFrom-unique">प्रकोप चयन गर्नुहोस् *</label>
            <select id="reliefFrom-unique" value={disaster} onChange={(e) => setDisaster(e.target.value)}>
  <option value="">Select a Disaster</option>
  <option value="earthquake">भूकम्प (Earthquake)</option>
  <option value="flood">बाढी (Flood)</option>
  <option value="landslide">पहिरो (Landslide)</option>
  <option value="fire">आगो (Fire)</option>
  {/* ... Add more disaster options as needed ... */}
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
            <label htmlFor="municipality-unique">पालिका चयन गर्नुहोस् *</label>
            <select id="municipality-unique" value={palika} onChange={(e) => setPalika(e.target.value)}>
  <option value="">Select a Palika</option>
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
            <input type="text" id="ward-unique" value={ward} onChange={(e) => setWard(e.target.value)} />
          </div>
          <div className="form-section-unique">
            <label htmlFor="location-unique">Location (स्थान) *</label>
            <div className="location-input-wrapper">
              <input type="text" id="location-unique" value={location} onChange={(e) => setCoordinate(e.target.value)} />
              <button type="button" className="location-icon" onClick={getCurrentLocation}>
                <i className="fas fa-map-marker-alt"></i>
              </button>
            </div>
          </div>
          <div id="map-unique">
           {hidepopup && ( <OpenLayersMap hidepopup={hidepopup} location={location}  /> )}
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
