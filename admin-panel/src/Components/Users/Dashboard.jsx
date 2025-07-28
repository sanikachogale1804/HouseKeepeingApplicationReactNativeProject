import React, { useState } from 'react';
import logo from '../Images/logo.png';
import { Link } from 'react-router-dom';
import '../CSS/AdminPanel.css';

function Dashboard() {
  const subfloors = [
    'East Lobby Area',
    'West Lobby Area',
    'Washroom',
    'Common Area',
    'Back Tericota',
    'Marble Tericota',
    'Meeting Room',
    'Conference Room',
    'Pantry Area',
  ];

  const getSuffix = (n) => {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
  };

  const floorOptionsEn = [
    'Basement 2',
    'Basement 1',
    'Ground Floor',
    'MZ Floor',
    ...Array.from({ length: 27 }, (_, i) => `${getSuffix(i + 1)} Floor`),
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="admin-title">Admin Panel</div>
        <ul className="sidebar-links">
          <li><Link className="sidebar-link" to="/dashboard">Dashboard</Link></li>
          <li><Link className="sidebar-link" to="/admin">User Management</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-container" style={{ marginLeft: '260px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h3>Floor List</h3>
          <select>
            <option disabled selected>-- Select Subfloor --</option>
            {subfloors.map((sub, index) => (
              <option key={index}>{sub}</option>
            ))}
          </select>
        </div>

        <ul style={{ marginTop: '20px' }}>
          {floorOptionsEn.map((floor, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {floor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
