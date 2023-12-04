// Leakage.js

import React, { useState } from 'react';
import './Leakage.css';

function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return currentDate.toLocaleDateString(undefined, options);
}

function Leakage() {
  const [messages, setMessages] = useState([
    { id: 1, status: 'pending', text: 'Pipe leakage near IOE WRC - Pending resolution' },
    { id: 2, status: 'resolved', text: 'Pipe leakage near IOE WRC resolved - No further action required' },
    // Add more messages as needed
  ]);

  const resolveMessage = (id) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, status: 'resolved' } : message
      )
    );
  };

  return (
    <div className="network-analysis-container">
      <h2>Pipe Leakage Messages</h2>
      <div className="network-analysis">
        <ul className="leakage-list">
          {messages.map((message) => (
            <li key={message.id} className={`feature-lekage ${message.status}`}>
              {message.status === 'pending' && (
                <button className="resolve-button" onClick={() => resolveMessage(message.id)}>
                  Resolve
                </button>
              )}
              <div className="feature-content">
                <div className="date">
                  <i className="calendar-icon">&#128197;</i> {getCurrentDate()}
                </div>
                <p>{message.text}</p>
              </div>
              <div className="feature-header">
                {message.status === 'pending' && (
                  <span className="status-icon">&#128558; Pending</span>
                )}
                {message.status === 'resolved' && (
                  <span className="status-icon">&#10004; Resolved</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leakage;
