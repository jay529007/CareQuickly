import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: BASE_URL,
  // baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
