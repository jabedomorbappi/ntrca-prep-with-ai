import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <style>{`
        .navbar-custom { background-color: #ffffff; border-bottom: 1px solid rgba(0,0,0,0.08); }
        .brand-logo { font-weight: 800; font-size: 1.5rem; color: #4f46e5; text-decoration: none; }
        .nav-link-custom { color: #4b5563 !important; font-weight: 500; padding: 0.5rem 1rem !important; transition: 0.2s; }
        .nav-link-custom:hover { color: #4f46e5 !important; background: #f9fafb; border-radius: 6px; }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">ExamForge</Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/history">Exam History</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}