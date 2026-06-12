import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="container px-3 px-sm-4 py-4">
        <Outlet />
      </div>
    </>
  );
}


