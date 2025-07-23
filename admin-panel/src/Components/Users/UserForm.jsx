import React, { useState, useEffect } from "react";

const UserForm = ({ onSubmit, initialData, onCancel }) => {
  const [user, setUser] = useState({
    username: "",
    userPassword: "",
    role: "USER",
  });

  useEffect(() => {
    if (initialData) setUser(initialData);
  }, [initialData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(user);
      }}
    >
      <input
        type="text"
        placeholder="Username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={user.userPassword}
        onChange={(e) => setUser({ ...user, userPassword: e.target.value })}
        required
      />
      <select
        value={user.role}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
      >
        <option value="ADMIN">ADMIN</option>
        <option value="SUPERVISOR">SUPERVISOR</option>
        <option value="USER">USER</option>
        <option value="USER">HOUSEKEEPER</option>
      </select>
      <button type="submit">Save</button>
      {onCancel && <button onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;
