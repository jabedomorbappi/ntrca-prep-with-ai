// import { Navigate, Outlet } from "react-router-dom";

// export default function ProtectedRoute() {
//   const token = localStorage.getItem("access_token");

//   // If token is missing, bounce them out to the login screen
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // If token exists, allow them down the nested route tree
//   return <Outlet />;
// }