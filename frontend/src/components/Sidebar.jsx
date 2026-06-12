import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar bg-white border-end vh-100 p-3" style={{ width: '250px' }}>
      <h5 className="mb-4 text-primary">Menu</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/">🏠 Home</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/history">📊 Exam History</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-dark" to="/profile">👤 Profile</Link>
        </li>
      </ul>
    </div>
  );
}