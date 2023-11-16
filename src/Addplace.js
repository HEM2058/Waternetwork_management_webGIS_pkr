import React, { useState } from 'react';
import './Addplace.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Addplace = () => {
  const [selectedPalika, setSelectedPalika] = useState('');
  const [placeTitle, setPlaceTitle] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [placeImage, setPlaceImage] = useState(null);
  const [placeCoordinates, setPlaceCoordinates] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userPalikaName = queryParams.get('userPalikaName') || 'Default Palika Name';
  console.log(userPalikaName)
  const navigate = useNavigate();

  const handlePalikaChange = (e) => {
    setSelectedPalika(e.target.value);
  };

  const handleTitleChange = (e) => {
    setPlaceTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setPlaceDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setPlaceImage(e.target.files[0]);
  };

  const handleCoordinatesChange = (e) => {
    setPlaceCoordinates(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userToken = localStorage.getItem('authToken');

    if (userToken) {
      console.log({
        selectedPalika,
        placeTitle,
        placeDescription,
        placeImage,
        placeCoordinates,
      });
      // Add logic to handle form submission with the user token
    } else {
      navigate('/Log-in');
    }
  };

  return (
    <div className="container-addplace">
      <h2>Add Place</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="municipality-unique">Select Palika:</label>
          <select id="municipality-unique" value={userPalikaName}>
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

        <div className="form-group">
          <label htmlFor="place-title">Place Title:</label>
          <input
            type="text"
            className="form-control"
            id="place-title"
            value={placeTitle}
            onChange={handleTitleChange}
            placeholder="Enter place title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="place-description">Place Description (max 120 words):</label>
          <textarea
            className="form-control"
            id="place-description"
            rows="5"
            maxLength="120"
            value={placeDescription}
            onChange={handleDescriptionChange}
            placeholder="Enter place description"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="place-image">Place Image:</label>
          <input
            type="file"
            className="form-control-file"
            id="place-image"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="place-coordinates">Place Coordinates (Lat, Long):</label>
          <input
            type="text"
            className="form-control"
            id="place-coordinates"
            value={placeCoordinates}
            onChange={handleCoordinatesChange}
            placeholder="Enter coordinates"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Addplace;
