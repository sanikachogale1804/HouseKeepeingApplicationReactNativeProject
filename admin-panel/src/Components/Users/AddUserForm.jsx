import React, { useState } from 'react';

function UserForm({ onUserAdded }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      role,
      email,
    };

    try {
      const response = await fetch('http://localhost:5005/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const savedUser = await response.json();
        onUserAdded(savedUser); // Notify parent
        setName('');
        setRole('');
        setEmail('');
        alert('User added successfully!');
      } else {
        alert('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding user');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New User</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="">Select Role</option>
        <option value="ADMIN">Admin</option>
        <option value="USER">User</option>
      </select>
      <br />
      <button type="submit">Add User</button>
    </form>
  );
}

export default UserForm;
