import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>NTRCA ICT Preparation</h1>

      <ul>
        <li>
          <Link to="/subjects">Subjects</Link>
        </li>

        <li>
          <Link to="/analytics">Analytics</Link>
        </li>

        <li>
          <Link to="/upload">Upload PDF</Link>
        </li>
      </ul>
    </div>
  );
}