import axios from "axios";

// This pulls from your Vercel Environment Variable (VITE_API_URL)
// If not found, it defaults to localhost for development
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: baseURL,
});

/**
 * 1. REQUEST INTERCEPTOR
 * Automatically attaches the JWT token to requests,
 * but skips authentication for public routes.
 */
api.interceptors.request.use(
  (config) => {
    const publicRoutes = [
      "/api/accounts/register/", 
      "/api/token/", 
      "/api/token/refresh/"
    ];
    
    // Check if the current request URL is public
    const isPublicRoute = publicRoutes.some((route) => config.url.includes(route));

    if (!isPublicRoute) {
      const token = localStorage.getItem("access") || localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 2. RESPONSE INTERCEPTOR
 * Automatically refreshes the access token when it expires (401 error).
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request fails due to 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        
        // Use 'api' instance instead of 'axios' to keep the production baseURL
        const res = await api.post("/api/token/refresh/", { refresh });
        
        // Update storage with new token
        localStorage.setItem("access", res.data.access);
        
        // Update headers and retry the original request
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, clear everything and redirect to login
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;