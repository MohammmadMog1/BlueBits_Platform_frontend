import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  //   baseURL: "/api/v1.0.0", 
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default apiClient;