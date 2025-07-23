// src/services/UserService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005",
});

const Api_link = "http://localhost:5005/users";

export const getUsers = () => {
  return fetch(Api_link)
    .then((response) => response.json())
    .then((data) => data);
};
