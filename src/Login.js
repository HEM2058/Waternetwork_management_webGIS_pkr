import React, { useState } from 'react';
import './Login.css'; // Import custom CSS for styling

function Login() {
  const [serverError, setServerError] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // Make an API request to Djoser's token creation endpoint
      const response = await fetch('http://127.0.0.1:8000/auth/token/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
     
      if (response.ok) {
        // If the response is successful, parse the JSON response
        const data = await response.json();
        // Assuming the token is received in the response
        const token = data.auth_token;
        console.log(token)
        // Save the token in local storage
        localStorage.setItem('token', token);
        // Reload the window to display other components
        window.location.reload();
      } else {
        // If the response is not successful, handle the error
        console.error('Login failed:', response.statusText);
        // Update the state to display the error message to the user
        setServerError({ message: 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      // Handle any network or server errors
      console.error('Error during login:', error);
      // Update the state to display the error message to the user
      setServerError({ message: 'An error occurred. Please try again later.' });
    }
  };

  const handleCloseClick = () => {
    // Handle close button click
  };

  const handleSignupButtonClick = () => {
    // Handle signup button click
  };

  const handleForgotPasswordClick = () => {
    // Handle forgot password button click
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h2>Admin Login</h2>
        <div className='input-div'>
          <input type="email" name="email" placeholder="Email" className="signin-input" />
          <input type="password" name="password" placeholder="Password" className="signin-input" />
        </div>
        <div className="form-options">
          <button type="submit" className="signin-button"> Login</button>
        </div>
      </form>
      <div className="signup-options">
        <p>
          <i className="fas fa-exclamation-triangle"></i> If you are not an authorized person, please refrain from attempting to login. This page is intended for administrators and PWDMS staff. Unauthorized login attempts are tracked by our application.
        </p>
      </div>
      <button className="close-button" onClick={handleCloseClick}><i className="fa fa-times"></i></button>
    </div>
  );
}

export default Login;
