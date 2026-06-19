import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; 

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/syllabus/subjects/");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error loading subjects:", err);
      setError("Failed to load subjects. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center"><h3>Loading Syllabus...</h3></div>;
  if (error) return <div className="p-5 text-center text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Subjects</h2>

      <div className="row">
        {subjects.map((s) => (
          <div key={s.id} className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <Link to={`/topics/${s.id}`} className="text-decoration-none">
                <h4 className="text-primary">{s.name}</h4>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}