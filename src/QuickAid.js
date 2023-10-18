import React, { Component } from 'react';
import './QuickAid.css';

const localLevels = [
  'Bithadchir',
  'Bungal',
  'Chabispathivera',
  'Durgathali',
  'JayaPrithivi',
  'Kanda',
  'Kedarseu',
  'Khaptadchhanna',
  'Masta',
  'Surma',
  'Talkot',
  'Thalara',
];

class QuickAid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      address: '',
      municipality: '',
      helpFor: '',
      description: '',
      location: '',
      file: null,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Process form submission here
  };

  render() {
    return (
      <div className="quick-aid-container">
        <h1 className="quick-aid-heading">Quick Aid for Disaster, Crime, and More</h1>
        <form onSubmit={this.handleSubmit} className="quick-aid-form">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={this.state.phone}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={this.state.address}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="municipality">Municipality</label>
              <select
                id="municipality"
                name="municipality"
                value={this.state.municipality}
                onChange={this.handleInputChange}
                required
              >
                <option value="">Select a municipality</option>
                {localLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="helpFor">Help For</label>
              <select
                id="helpFor"
                name="helpFor"
                value={this.state.helpFor}
                onChange={this.handleInputChange}
                required
              >
                <option value="">Select an option</option>
                <option value="Disaster Rescue">Disaster Rescue</option>
                <option value="Crime Assistance">Crime Assistance</option>
                <option value="Medical Emergency">Medical Emergency</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="file">Upload Image/Video/Audio</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={this.handleFileChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location (Lat, Lon)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={this.state.location}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="map-field">
              {/* Add the map field here */}
            </div>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default QuickAid;
