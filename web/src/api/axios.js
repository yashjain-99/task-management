import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_DOMAIN}:${
  import.meta.env.VITE_API_PORT
}/api`;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
