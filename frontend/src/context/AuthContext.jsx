import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to pull profile details when a token exists
  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/api/accounts/profile/");
      setUser(res.data);
    } catch (err) {
      logout(); // Clean up if the token is invalid/expired
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUserProfile();
  }, []);

  // 🎯 KEEP ONLY THIS ONE LOGIN FUNCTION (Delete the other duplicate declaration!)
//   const login = async (accessToken, refreshToken) => {
//     localStorage.setItem("access_token", accessToken);
//     localStorage.setItem("refresh_token", refreshToken);
//     await fetchUserProfile();
//   };
// Inside your AuthProvider component in AuthContext.jsx:

const login = async (accessToken, refreshToken) => {
  // 1. Store tokens securely
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  
  // 2. Explicitly apply the token header to the api instance immediately for the profile fetch
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  
  // 3. Fetch profile details
  await fetchUserProfile();
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  
  // 🎯 Clear the headers on logout
  delete api.defaults.headers.common["Authorization"];
  
  setUser(null);
  setLoading(false);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}