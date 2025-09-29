import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Api_link from '../Config/apiconfig';
import '../CSS/LoginForm.css';
import logo from "../Images/logo.png";

function LoginForm() {
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleLogin = async () => {
    try {
      const url = `${Api_link}/login?username=${encodeURIComponent(username)}&userPassword=${encodeURIComponent(userPassword)}`;
      const response = await fetch(url);
      const token = await response.text();

      if (response.ok && token && token.length > 10) {
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.roles?.[0] || decoded.authorities?.[0];

        if (!role || role.toLowerCase() !== 'admin') {
          alert('⛔ Access Denied: Only admin can log in');
          return;
        }

        localStorage.setItem('token', token);
        alert('✅ Login successful!');
        window.location.href = '/admin-panel/dashboard';
      } else {
        alert('❌ Login failed: Invalid credentials');
      }
    } catch (err) {
      alert('⚠️ Could not connect to server');
    }
  };

  return (
    <div className="login-container">
      {/* Use a clean background image without the text for this setup */}
      {/* Container for the custom headings */}

      <div className="custom-headings">
        <div className="heading-with-logo">
          <img src={logo} alt="Logo" className="heading-logo" />
          <h1 className="main-heading">COGENT</h1>
        </div>
        <h3 className="sub-heading">FACILITIES MANAGEMENT SERVICES </h3>
        <h4 className="sub-heading-small">HOUSEKEEPING & FACILITIES MANAGEMENT</h4>
      </div>


      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Admin Login</h2>
        <input
          className="login-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
        />
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginForm;