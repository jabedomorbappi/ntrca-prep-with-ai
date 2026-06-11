import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Path to your custom authentication context hook

export default function Navbar() {
  const { user, logout } = useAuth(); // Read global authentication state and logout handler
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close the user avatar dropdown menu gracefully if clicking anywhere outside of it
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

  // Get dynamic name initials fallback if an explicit user profile avatar image isn't loaded
  const initials = user && user.username ? user.username.substring(0, 2).toUpperCase() : "EF";

  return (
    <>
      <style>{`
        .navbar-custom {
          background-color: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }
        .brand-logo {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .nav-link-custom {
          color: #4b5563 !important;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-link-custom:hover {
          color: #4f46e5 !important;
        }
        .btn-gradient-sm {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white !important;
          border: none;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.5rem 1.25rem;
          transition: opacity 0.2s ease;
        }
        .btn-gradient-sm:hover {
          opacity: 0.9;
        }
        .profile-trigger {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid #e0e7ff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          user-select: none;
        }
        .profile-trigger:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .dropdown-menu-custom {
          border: none !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
          border-radius: 12px !important;
          padding: 0.5rem !important;
          min-width: 200px;
        }
        .dropdown-item-custom {
          border-radius: 8px !important;
          padding: 0.5rem 1rem !important;
          color: #374151 !important;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .dropdown-item-custom:hover {
          background-color: #f3f4f6 !important;
          color: #4f46e5 !important;
        }
        .dropdown-item-danger {
          color: #dc2626 !important;
        }
        .dropdown-item-danger:hover {
          background-color: #fef2f2 !important;
          color: #dc2626 !important;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-custom sticky-top py-3">
        <div className="container">
          
          {/* Logo Heading Identity */}
          <Link className="navbar-brand brand-logo text-uppercase mb-0" to="/">
            ExamForge
          </Link>

          {/* Core App Main Links (Visible to everyone) */}
          <div className="d-flex align-items-center ms-auto ms-lg-4 order-lg-2">
            {user ? (
              /* 👤 AUTHENTICATED STATE: Show Dropdown Menu Container */
              <div className="dropdown" ref={dropdownRef}>
                <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                  {user.image ? (
                    <img src={user.image} alt="User Avatar" className="avatar-img" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-custom mt-2 border-0 ${showDropdown ? "show" : ""}`} style={{ position: "absolute", right: 0 }}>
                  <li>
                    <div className="px-3 py-2">
                      <p className="text-dark fw-bold mb-0 small text-capitalize">{user.username || "User Profile"}</p>
                      <p className="text-muted small text-truncate mb-0">{user.email || "Verified Candidate"}</p>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider opacity-50" /></li>
                  <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/profile" onClick={() => setShowDropdown(false)}>
                      👤 Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/history" onClick={() => setShowDropdown(false)}>
                      📊 Exam History
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider opacity-50" /></li>
                  <li>
                    <button className="dropdown-item dropdown-item-custom dropdown-item-danger d-flex align-items-center w-100 border-0 bg-transparent" onClick={handleLogout}>
                      🚪 Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* 🔑 GUEST STATE: Show a clean, standalone navigation gateway link button */
              <Link to="/login" className="btn btn-gradient-sm rounded-3 shadow-sm text-decoration-none">
                Sign In
              </Link>
            )}

            {/* Mobile Responsive Hamburger Toggle */}
            <button 
              className="navbar-toggler border-0 ms-2 p-1 focus-none" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#examForgeNavbar" 
              aria-controls="examForgeNavbar" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" style={{ width: "1.25rem", height: "1.25rem" }}></span>
            </button>
          </div>

          {/* Left / Middle Navigation Area Links */}
          <div className="collapse navbar-collapse order-lg-1" id="examForgeNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link className="nav-link nav-link-custom pe-3" to="/">
                  Home
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom pe-3" to="/history">
                    History
                  </Link>
                </li>
              )}
            </ul>
          </div>

        </div>
      </nav>
    </>
  );
}