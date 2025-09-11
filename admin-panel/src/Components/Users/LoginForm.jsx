import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import (note: no curly braces)
import Api_link from '../Config/apiconfig';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleLogin = async () => {
    try {
      const url = `${Api_link}/login?username=${encodeURIComponent(username)}&userPassword=${encodeURIComponent(userPassword)}`;

      const response = await fetch(url); // GET request
      const token = await response.text(); // Raw token

      if (response.ok && token && token.length > 10) {
        // ✅ Decode the token
        const decoded = jwtDecode(token);

        // 🔐 Extract role
        const role = decoded.role || decoded.roles?.[0] || decoded.authorities?.[0];

        // 🚫 Only allow admin
        if (!role || role.toLowerCase() !== 'admin') {
          alert('⛔ Access Denied: Only admin can log in');
          return;
        }

        // ✅ Store and proceed
        localStorage.setItem('token', token);
        alert('✅ Login successful!');
        window.location.href = '/dashboard';
      } else {
        alert('❌ Login failed: Invalid credentials');
      }
    } catch (err) {
      alert('⚠️ Could not connect to server');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        style={{ padding: 8, width: '100%', marginBottom: 12 }}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setUserPassword(e.target.value)}
        value={userPassword}
        style={{ padding: 8, width: '100%', marginBottom: 12 }}
      />

      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
        Login
      </button>
    </div>
  );
}

export default LoginForm;
