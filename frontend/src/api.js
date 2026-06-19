import axios from "axios";

// This pulls from your Vercel Environment Variable (VITE_API_URL)
// If not found, it defaults to your production backend URL
const baseURL = import.meta.env.VITE_API_URL || "https://ntrca-prep-with-ai.onrender.com";

const api = axios.create({
  baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`, // Ensures a trailing slash
});



export default api;