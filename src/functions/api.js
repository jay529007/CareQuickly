import axios from "axios";

const api = axios.create({
  // baseURL: "https://json-lldi.onrender.com/api",
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
