import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../CSS/ImageCalendar.css'

const ImageCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Date format: yyyy-mm-dd
    const dateStr = selectedDate.toISOString().split('T')[0];

    // Example API call – replace with your actual endpoint
    fetch(`http://localhost:8080/images?date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        setImages(data);
      })
      .catch(err => {
        console.error('Error fetching images:', err);
      });
  }, [selectedDate]);

  return (
    <div>
      <h2>Select Date to View Images</h2>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
      />
      <div className="image-row">
        {images.map((img, index) => (
          <div key={index} className="image-card">
            <img src={img.url} alt={`img-${index}`} />
            <p>{img.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCalendar;
