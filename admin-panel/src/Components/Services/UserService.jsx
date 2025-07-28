// src/services/UserService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005",
});

const Api_link = "http://localhost:5005/users";
const FloorApi = "http://localhost:5005/floorData";

// Existing function
export const getUsers = () => {
  return fetch(Api_link)
    .then((response) => response.json())
    .then((data) => data);
};

export const getFloors = async () => {
  try {
    const res = await fetch('http://localhost:5005/floorData');
    const data = await res.json();
    // Safely extract array from HAL-style response
    return data._embedded?.floorDatas || []; // ✅ extract the array
  } catch (error) {
    console.error('Failed to fetch floor data:', error);
    return [];
  }
};

const handleFetchImages = async () => {
  try {
    const response = await fetch(`http://localhost:5005/floorData/${selectedFloorId}/image`);
    if (!response.ok) {
      throw new Error('Failed to fetch image list');
    }

    const imageNames = await response.json();
    const imageUrls = imageNames.map(name => `http://localhost:5005/images/${name}`); // update path if needed
    setImages(imageUrls);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};
