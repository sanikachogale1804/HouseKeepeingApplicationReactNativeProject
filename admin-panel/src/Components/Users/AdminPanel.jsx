import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateUserForm from './UpdateUserForm';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    userPassword: '',
    role: ''
  });
  const [editingUser, setEditingUser] = useState(null); // selected user object

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5005/users')
      .then(response => {
        const embeddedUsers = response.data._embedded?.users || [];
        setUsers(embeddedUsers);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5005/register', newUser)
      .then(response => {
        console.log("User added:", response.data);
        setNewUser({ username: '', userPassword: '', role: '' });
        fetchUsers();
      })
      .catch(error => {
        console.error("Error adding user:", error);
      });
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    fetchUsers(); // Refresh list after update
  };

  const handleEditClick = (user) => {
    setEditingUser(user); // pass whole user object
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>

      <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="userPassword"
          placeholder="Password"
          value={newUser.userPassword}
          onChange={handleInputChange}
          required
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="HOUSEKEEPER">Housekeeper</option>
          <option value="SUPERVISOR">Supervisor</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {editingUser ? (
        <UpdateUserForm
          user={editingUser}
          onSuccess={handleEditSuccess}
        />
      ) : (
        <>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.username} – {user.role}
                  <button onClick={() => handleEditClick(user)} style={{ marginLeft: '10px' }}>
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

    </div>
  );
}

export default AdminPanel;
