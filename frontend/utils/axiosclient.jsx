import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: backendUrl,
});

// Automatically attach token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;