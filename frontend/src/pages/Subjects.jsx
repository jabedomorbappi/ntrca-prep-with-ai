import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; 

export default function Subjects() {

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/api/syllabus/subjects/");
    setSubjects(res.data);
  };

  return (
    <div>
      <h2>Subjects</h2>

      {subjects.map((s) => (
        <div key={s.id} style={{ margin: "10px" }}>

          <Link to={`/topics/${s.id}`}>
            <h3>{s.name}</h3>
          </Link>

        </div>
      ))}
    </div>
  );
}