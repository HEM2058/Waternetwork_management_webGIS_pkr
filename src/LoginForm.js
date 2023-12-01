import React, { useState } from 'react';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request to Djoser's token creation endpoint
      const response = await fetch('http://127.0.0.1:2500/auth/token/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: name,  // Assuming email is used for login based on your Djoser configuration
          password: password,
        }),
      });

      const data = await response.json();

      // Check if the authentication was successful based on the API response
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('authToken', data.auth_token);
        
        // Redirect to the Palika dashboard on successful authentication
        navigate('/palika_dashboard');
      } else {
        // Display error message on authentication failure
        setError(data.non_field_errors || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('An error occurred during authentication');
    }

    // Clear the form fields after submission
    setName('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <h1 className="login-header">
        <FontAwesomeIcon icon={faBuilding} /> Pokhara Metro Login
      </h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Email:</label>
          <input className="text" type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div>
          <button type="submit"> Log in</button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="warning-message">
        <FontAwesomeIcon icon={faExclamationTriangle} /> If you are an unauthorized person, please leave this page.
      </p>
    
    </div>
  );
};

export default LoginForm;
