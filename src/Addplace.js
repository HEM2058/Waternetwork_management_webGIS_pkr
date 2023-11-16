import React, { useState } from 'react';
import './Addplace.css';
import { useNavigate } from 'react-router-dom';

const Addplace = () => {
  const [selectedPalika, setSelectedPalika] = useState('');
  const [placeTitle, setPlaceTitle] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [placeImage, setPlaceImage] = useState(null);
  const [placeCoordinates, setPlaceCoordinates] = useState('');
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
          <select
            className="form-control"
            id="municipality-unique"
            value={selectedPalika}
            onChange={handlePalikaChange}
          >
            <option value="Bungal">बुङ्गल नगरपालिका</option>
            <option value="Bitthadchir">बित्थडचिर गाँउपालिका</option>
            {/* Add other options as needed */}
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
