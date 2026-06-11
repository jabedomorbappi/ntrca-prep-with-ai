import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function Topics() {

  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    load();
  }, [subjectId]);

  const load = async () => {
    const res = await api.get(`/api/syllabus/topics/${subjectId}/`);
    setTopics(res.data);
  };

  return (
    <div>
      <h2>Topics</h2>

      {topics.map((t) => (
        <div key={t.id} style={{ margin: "10px" }}>

          {/* 🔥 THIS IS THE IMPORTANT FIX */}
          <Link to={`/subtopics/${t.id}`}>
            <h3 style={{ cursor: "pointer", color: "blue" }}>
              {t.name}
            </h3>
          </Link>

        </div>
      ))}
    </div>
  );
}