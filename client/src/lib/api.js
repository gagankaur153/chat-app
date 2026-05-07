import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
