import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../CSS/Report.css";
import Api_link from '../Config/apiconfig';

const Report = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageURLs, setImageURLs] = useState({});

  // Fetch all images from backend
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem("token"); // optional, if backend requires auth
      const res = await fetch(`${Api_link}/floorData/images?page=0&size=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      console.log("Backend response:", data);
      const allData = data._embedded?.floorDatas || data; // fallback if no _embedded
      setImages(allData);

      // Pre-build image URLs
      const urls = {};
      allData.forEach((item) => {
        urls[item.id] = `${Api_link}/floorData/${item.id}/image`;
      });
      setImageURLs(urls);

    } catch (error) {
      console.error("Error fetching floor data:", error);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full end day

    const result = images.filter((item) => {
      if (!item.taskImage) return false;

      // Extract date from filename: YYYY-MM-DD-HH-MM
      const match = item.taskImage.match(/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/);
      if (!match) return false;

      const [y, m, d, hr, min] = match[0].split("-").map(Number);
      const date = new Date(y, m - 1, d, hr, min);

      return date >= start && date <= end;
    });

    console.log("Filtered images:", result);
    setFilteredImages(result);
  };

  const extractDateFromFilename = (filename) => {
    const match = filename.match(/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/);
    if (!match) return null;

    const [y, m, d, hr, min] = match[0].split("-").map(Number);
    const date = new Date(y, m - 1, d, hr, min);
    return date.toLocaleString();
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.querySelector(".report-table");
    if (!reportElement) {
      alert("No content to export.");
      return;
    }

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const pages = Math.ceil(pdfHeight / 297);
    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -i * 297, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
    }

    pdf.save(`Image_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Image Report (All Floors)</h2>

      <div className="filter-bar">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button className="fetch-button" onClick={handleFilter}>
          Fetch Images
        </button>
        <button className="download-button" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      {filteredImages.length === 0 ? (
        <p className="no-images">No images found for selected date range.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Images</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              filteredImages.reduce((acc, img) => {
                const dateOnly = img.taskImage.match(/\d{4}-\d{2}-\d{2}/)?.[0];
                if (!dateOnly) return acc;
                if (!acc[dateOnly]) acc[dateOnly] = [];
                acc[dateOnly].push(img);
                return acc;
              }, {})
            ).map(([date, images]) => (
              <tr key={date}>
                <td className="date-column">{date}</td>
                <td className="images-column">
                  <div className="image-row">
                    {images.map((img) => (
                      <div key={img.id} className="image-card">
                        <p className="floor-label">
                          <strong>{img.floorName}</strong> – {img.subFloorName}
                        </p>
                        <p>Type: {img.imageType}</p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {extractDateFromFilename(img.taskImage)?.split(",")[1]}
                        </p>
                        {imageURLs[img.id] ? (
                          <img src={imageURLs[img.id]} alt={img.taskImage} />
                        ) : (
                          <p>Loading image...</p>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Report;
