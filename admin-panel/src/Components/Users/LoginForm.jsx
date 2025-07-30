import React, { useState } from 'react';
import  { jwtDecode } from 'jwt-decode'; // ✅ Correct import (note: no curly braces)

function LoginForm() {
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleLogin = async () => {
    try {
      const baseUrl = 'http://192.168.1.92:5005';
      const url = `${baseUrl}/login?username=${encodeURIComponent(username)}&userPassword=${encodeURIComponent(userPassword)}`;

      const response = await fetch(url);
      const token = await response.text();

      if (response.ok && token && token.length > 10) {
        // ✅ Decode the JWT
        const decoded = jwtDecode(token);
        console.log('🧠 Decoded Token:', decoded);

        // ✅ Ensure backend sends `role` inside token
        const role = decoded.role;

        if (role === 'admin') {
          localStorage.setItem('token', token);
          alert('✅ Login successful!');
          window.location.href = '/image-fetcher';
        } else {
          alert(`❌ Access Denied. Only 'admin' role is allowed. Your role: ${role}`);
        }
      } else {
        alert('❌ Login failed: Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
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
