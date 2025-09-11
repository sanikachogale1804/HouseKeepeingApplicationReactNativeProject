import React, { useState } from 'react';
import logo from '../Images/logo.png';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../CSS/AdminPanel.css';
import '../CSS/Dashboard.css';

import Api_link from '../Config/apiconfig';

function Dashboard() {
  const [selectedSubfloor, setSelectedSubfloor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const subfloors = [
    'East Lobby Area', 'West Lobby Area', 'Washroom', 'Common Area',
    'Back Tericota', 'Marble Tericota', 'Meeting Room', 'Conference Room', 'Pantry Area',
  ];

  const getSuffix = (n) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return `${n}st`;
    if (j === 2 && k !== 12) return `${n}nd`;
    if (j === 3 && k !== 13) return `${n}rd`;
    return `${n}th`;
  };

  const floorOptionsEn = [
    'Basement 2',
    'Basement 1',
    'Ground Floor',
    'MZ Floor',
    ...Array.from({ length: 27 }, (_, i) => `${getSuffix(i + 1)} Floor`),
  ];

  const fetchImages = async () => {
    if (!selectedSubfloor) {
      alert('Please select a Subfloor.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated. Please login.');
        return;
      }

      const encodedSubfloor = encodeURIComponent(selectedSubfloor);
      const response = await fetch(
        `${Api_link}/floorData/images?subFloorName=${encodedSubfloor}`,   // ✅ dynamic
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched images:', data);
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to fetch images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const filteredImages = selectedDate
    ? images.filter((img) => {
        if (!img.taskImage) return false;
        const match = img.taskImage.match(/\d{4}-\d{2}-\d{2}/);
        if (!match) return false;

        const imageDate = match[0];
        const selected =
          selectedDate.getFullYear() +
          '-' +
          String(selectedDate.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(selectedDate.getDate()).padStart(2, '0');

        return imageDate === selected;
      })
    : images;

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
          <li><Link className="sidebar-link" to="/report">Report</Link></li>
        </ul>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-main">
        <h2>Fetch Images by Subfloor and Date</h2>

        <div className="dashboard-controls">
          <select onChange={(e) => setSelectedSubfloor(e.target.value)} value={selectedSubfloor}>
            <option disabled value="">-- Select Subfloor --</option>
            {subfloors.map((sub, i) => (
              <option key={i}>{sub}</option>
            ))}
          </select>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Select a date"
            dateFormat="yyyy-MM-dd"
            className="datepicker"
          />

          <button onClick={fetchImages} disabled={loading}>
            {loading ? 'Loading...' : 'Search Image'}
          </button>
        </div>

        <div className="dashboard-image-section">
          <h3>
            Floor List with Images ({selectedSubfloor || 'None'})
            {selectedDate && ` on ${formatDate(selectedDate)}`}
          </h3>
          <table className="floor-image-table">
            <thead>
              <tr>
                <th>Floor Name</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {floorOptionsEn.map((floor, index) => {
                const floorImages = filteredImages.filter(
                  (img) =>
                    img.floorName === floor &&
                    img.subFloorName === selectedSubfloor
                );

                return (
                  <tr key={index}>
                    <td>{floor}</td>
                    <td>
                      {floorImages.length > 0 ? (
                        <div className="floor-image-row">
                          {floorImages.map((img) => (
                            <div key={img.id} className="image-item">
                              <img
                                src={`${Api_link}/floorData/${img.id}/image`}   // ✅ dynamic
                                alt={img.taskImage}
                                className="floor-thumbnail"
                                onClick={() =>
                                  setPreviewImage(`${Api_link}/floorData/${img.id}/image`) // ✅ dynamic
                                }
                              />
                              <span className="image-label">{img.taskImage}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="no-image">No images</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {previewImage && (
          <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
            <img src={previewImage} alt="Full View" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
