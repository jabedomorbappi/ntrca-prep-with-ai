// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  // If no token exists, force redirect to the login page immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}