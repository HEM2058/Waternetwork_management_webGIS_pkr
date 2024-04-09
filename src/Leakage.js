import React, { useState, useEffect } from 'react';
import './Leakage.css';

function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return currentDate.toLocaleDateString(undefined, options);
}

function Leakage({ OnViewOnMap}) {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Fetch data from API
    fetch('http://127.0.0.1:8000/api/issues-view/')
      .then(response => response.json())
      .then(data => setIssues(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array to fetch data only once on component mount

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredIssues = filter
    ? issues.filter((issue) => issue.issue_type === filter)
    : issues;

  const handleResolved = (id) => {
    // Logic to mark issue as resolved
    console.log('Issue resolved:', id);
  };

  const handleViewOnMap = (geometry) => {
    // Logic to handle viewing issue on map
    OnViewOnMap(geometry)
  };

  return (
    <div className="Leakage-container">
      <h2>Issues</h2>
      <div className="filters">
        <select onChange={handleFilterChange}>
          <option value="">All Issues</option>
          <option value="LEAKAGE">Leakage</option>
          <option value="PIPE_INSTALLATION">Pipe Installation</option>
          <option value="WATER_ISSUE">Water Issue</option>
        </select>
      </div>
      <div className="Leakage">
        <ul className="leakage-list">
          {filteredIssues.map((issue) => (
            <li key={issue.id} className="feature-leakage">
              <div className="feature-content">
                <div className="date">
                  <i className="calendar-icon">&#128197;</i> {getCurrentDate()}
                </div>
                <p>
                  <i className="fas fa-comment"></i> {/* Font Awesome icon */}
                  <span>{issue.description}</span>
                </p>
                <p>
                  <strong>Client:</strong> {issue.client_name} ({issue.client_phone_number})
                </p>
               
              </div>
              <div className="feature-actions">
                <button onClick={() => handleResolved(issue.id)}>Resolved</button>
                <button onClick={() => handleViewOnMap(issue.geometry)}>View on Map</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leakage;
