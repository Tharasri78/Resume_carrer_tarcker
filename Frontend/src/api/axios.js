import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000/api"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

// 🔐 AUTO ATTACH TOKEN
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete API.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;