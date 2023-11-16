import React, { useEffect, useState } from 'react';
import './PalikaDashboard.css';
import { Link, useNavigate } from 'react-router-dom';

function PalikaDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user token exists
    const userToken = localStorage.getItem('authToken');

    if (!userToken) {
      // setError('You are not authorized to view this page. Please log in.');
      navigate('/Log-in')
    }
  }, []);

  const handleLogout = () => {
    // Clear the stored token on logout
    localStorage.removeItem('authToken');
    // Redirect to the Log in page
    navigate('/Log-in');
  };

  return (
    <div className="palika-dashboard">
      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : (
        <>
          {/* Palika Name */}
          <h1 className="palika-name">Surma Gaupalika Admin Panel</h1>
          <button onClick={handleLogout}>Logout</button>
          {/* Sections */}
          <div className='sections'>

            {/* Relief Request Section */}
            <div className="section">
              <div className="section-item">
                <Link to='/palika_dashboard/requests'><i className="fas fa-hands-helping"></i> Relief Request</Link>

                {/* Add your content for the Relief Request section here */}
              </div>
            </div>

            {/* Add Place Section */}
            <div className="section">
              <div className="section-item">
                <h3></h3>
                <Link to='/palika_dashboard/add_place'><i className="fas fa-map-marker-alt"></i> Add Place</Link>
                {/* Add your content for the Add Place section here */}
              </div>
            </div>

            {/* Publish Layer Section */}
            <div className="section">
              <div className="section-item">
                <Link to='/requests'><i className="fas fa-layer-group"></i> Publish Layer</Link>
                {/* Add your content for the Publish Layer section here */}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default PalikaDashboard;
