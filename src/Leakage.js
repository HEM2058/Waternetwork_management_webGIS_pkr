// Leakage.js

import React from 'react';
import './Leakage.css';

function Leakage() {
  const messages = [
    { status: 'pending', text: 'Pipe leakage near IOE WRC - Pending resolution' },
    { status: 'resolved', text: 'Pipe leakage near IOE WRC resolved - No further action required' },
    // Add more messages as needed
  ];

  return (
    <div className="network-analysis-container">
      <h2>Pipe Leakage Messages</h2>
      <div className="network-analysis">
        <ul className="leakage-list">
          {messages.map((message, index) => (
            <li key={index} className={`feature ${message.status}`}>
              <div className="feature-header">
                {message.status === 'pending' && (
                  <span className="status-icon">&#128558; Pending</span>
                )}
                {message.status === 'resolved' && (
                  <span className="status-icon">&#10004; Resolved</span>
                )}
              </div>
              <div className="feature-content">
                <p>{message.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leakage;
