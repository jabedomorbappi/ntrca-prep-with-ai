import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  const initials = user && user.username ? user.username.substring(0, 2).toUpperCase() : "EF";

  return (
    <>
      <style>{`
        .navbar-custom { background-color: #ffffff; border-bottom: 1px solid rgba(0,0,0,0.08); }
        .brand-logo { font-weight: 800; font-size: 1.5rem; color: #4f46e5; text-decoration: none; }
        .nav-link-custom { color: #4b5563 !important; font-weight: 500; padding: 0.5rem 1rem !important; transition: 0.2s; }
        .nav-link-custom:hover { color: #4f46e5 !important; background: #f9fafb; border-radius: 6px; }
        .profile-trigger { width: 42px; height: 42px; border-radius: 50%; background: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #e0e7ff; transition: 0.3s; }
        .profile-trigger:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2); }
        .dropdown-menu-custom { border-radius: 14px !important; padding: 0.75rem !important; min-width: 220px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important; margin-top: 10px !important; }
        .dropdown-item-custom { border-radius: 8px !important; padding: 0.6rem 1rem !important; font-size: 0.9rem; font-weight: 500; color: #374151; transition: 0.2s; }
        .dropdown-item-custom:hover { background-color: #f3f4f6; color: #4f46e5; }
        .btn-gradient-sm { background: #4f46e5; color: white; padding: 0.5rem 1.25rem; font-weight: 600; border-radius: 8px; transition: 0.2s; }
        .btn-gradient-sm:hover { background: #4338ca; color: white; }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">ExamForge</Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/">Home</Link></li>
              {user && <li className="nav-item"><Link className="nav-link nav-link-custom" to="/history">Exam History</Link></li>}
            </ul>

            <div className="d-flex align-items-center">
              {user ? (
                <div className="dropdown" ref={dropdownRef}>
                  <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                    {user.image ? <img src={user.image} className="rounded-circle w-100 h-100" /> : <span>{initials}</span>}
                  </div>

                  <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-custom ${showDropdown ? "show" : ""}`}>
                    <li className="px-3 pb-2">
                      <div className="small fw-bold text-dark text-truncate">{user.username}</div>
                      <div className="x-small text-muted text-truncate">{user.email}</div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item dropdown-item-custom" to="/profile" onClick={() => setShowDropdown(false)}>👤 Profile Settings</Link></li>
                    <li><button className="dropdown-item dropdown-item-custom text-danger" onClick={handleLogout}>🚪 Sign Out</button></li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-gradient-sm">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}