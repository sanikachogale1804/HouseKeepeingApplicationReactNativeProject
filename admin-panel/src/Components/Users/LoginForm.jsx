import React, { useState } from 'react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 👇 Update with your backend IP if not using localhost
      const baseUrl = 'http://localhost:5005';
      const url = `${baseUrl}/login?username=${encodeURIComponent(username)}&userPassword=${encodeURIComponent(userPassword)}`;

      const response = await fetch(url); // GET request, like React Native version
      const token = await response.text(); // Receive raw token (not JSON)

      console.log('🔑 Token:', token);

      if (response.ok && token && token.length > 10) {
        localStorage.setItem('token', token);
        alert('✅ Login successful!');
        // Optional: redirect or reload
        window.location.href = '/image-fetcher'; // Or any page you want to show
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
      <br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setUserPassword(e.target.value)}
        value={userPassword}
        style={{ padding: 8, width: '100%', marginBottom: 12 }}
      />
      <br />

      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
        Login
      </button>
    </div>
  );
}

export default LoginForm;
