import React, { useState } from 'react';
import './LoginForm.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faBuilding } from '@fortawesome/free-solid-svg-icons'; // Import a building icon (you can choose a different icon if needed)
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can add your authentication logic here.
    // For this example, we'll just log the values.
    console.log('Name:', name);
    console.log('Password:', password);

    // Clear the form fields after submission
    setName('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <h1 className="login-header">
        <FontAwesomeIcon icon={faBuilding} /> Palika Login
      </h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>ID:</label>
          <input className="text" type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <p className="warning-message">
        <FontAwesomeIcon icon={faExclamationTriangle} /> If you are an unauthorized person, please leave this page.
      </p>
    </div>
  );
  
};

export default LoginForm;
