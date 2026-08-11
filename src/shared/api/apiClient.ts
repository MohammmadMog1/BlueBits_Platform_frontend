import axios, { AxiosHeaders } from "axios";
import { store } from "../../app/store/store";
import { logout } from "../../features/auth/redux/authSlice";
import { startLoading, stopLoading } from "../../app/store/loadingSlice";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  store.dispatch(startLoading());

  const token = store.getState().auth.token;
  const headers = new AxiosHeaders(config.headers);

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    return response;
  },
  (error) => {
    store.dispatch(stopLoading());
    if (error.response?.status === 401) {
      store.dispatch(logout());

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
