import React, { useState } from 'react';

function ImageFetcher() {
  const [selectedSubfloor, setSelectedSubfloor] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const subfloors = [
    'East Lobby Area', 'West Lobby Area', 'Washroom', 'Common Area',
    'Back Tericota', 'Marble Tericota', 'Meeting Room', 'Conference Room', 'Pantry Area',
  ];

  const handleFetchImages = async () => {
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

      const response = await fetch(`http://localhost:5005/floorData/images?subFloorName=${encodedSubfloor}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Token might be expired or invalid.');
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json(); 
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to fetch images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Fetch Images by Subfloor</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select onChange={(e) => setSelectedSubfloor(e.target.value)} value={selectedSubfloor}>
          <option disabled value="">-- Select Subfloor --</option>
          {subfloors.map((sub, i) => (
            <option key={i}>{sub}</option>
          ))}
        </select>

        <button onClick={handleFetchImages} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Images'}
        </button>
      </div>

      {images.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {images.map((img) => (
            <div key={img.id} style={{ textAlign: 'center' }}>
              <p>{img.taskImage}</p>
              <img
                src={`http://localhost:5005/floorData/${img.id}/image`}
                alt={img.taskImage}
                width="250"
                style={{
                  border: '1px solid #ccc',
                  padding: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No images to display.</p>
      )}

      {images.length > 0 && (
        <p style={{ marginTop: '20px' }}>
          Total images found: <strong>{images.length}</strong>
        </p>
      )}
    </div>
  );
}

export default ImageFetcher;
