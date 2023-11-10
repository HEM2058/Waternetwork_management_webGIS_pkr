import React from 'react';
import './Relief.css';
import ReliefImg from './assets/Relief.jpg';
import { Link } from 'react-router-dom';

function Relief() {
  return (
    <div className="relief-container">
      <h1>Request for Relief Assistance</h1>
      <div className='TextImg'>
        <div className="description">
          <p>
            If you have recently experienced a disaster, we are here to assist you. Please fill out the form and click "Proceed" to submit your information. Provide details about your situation and attach images, helping us better understand the impact on your location or home.
          </p>
          <p>
            Once we receive your request, our team will promptly initiate the necessary relief efforts. After submission, the required assistance will be provided by your local municipality or ward.
          </p>
        </div>
        <div className="image-container">
          <img src={ReliefImg} alt="Relief" />
        </div>
      </div>

      <div className="relief-button-container">
        <Link to="/" className='cancel-button'>Cancel</Link>
        <Link to="/QuickAid" className='proceed-button'>Proceed</Link>
      </div>
    </div>
  );
}

export default Relief;
