import React, { useState } from 'react';
import './Leakage.css';

function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return currentDate.toLocaleDateString(undefined, options);
}

function Leakage() {
  const [issues, setIssues] = useState([
    {
      id: 1,
      latitude: 28.22750440274784,
      longitude: 84.00043810012062,
      issue_type: 'LEAKAGE',
      client_name: 'Hem Raj Pandey',
      client_phone_number: '9864766958',
      description: 'The pipe Leakage has been detected near Mahakaleshor marga',
    },
    {
      id: 2,
      latitude: 28.222374309808316,
      longitude: 83.97845115114251,
      issue_type: 'PIPE_INSTALLATION',
      client_name: 'Hem Raj Pandey',
      client_phone_number: '9864766958',
      description: "Please plan for pipeline installation at Pokhara Baglung highway's House.",
    },
    {
      id: 3,
      latitude: 28.223481692489173,
      longitude: 83.98003831921926,
      issue_type: 'WATER_ISSUE',
      client_name: 'Hem Raj Pandey',
      client_phone_number: '9864766958',
      description: "Water is not coming at this location's home since yesterday.",
    },
  ]);

  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredIssues = filter
    ? issues.filter((issue) => issue.issue_type === filter)
    : issues;

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
              <div className="feature-header">
                <span className="status-icon">{issue.issue_type}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leakage;
