import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; 

export default function ExamReview() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/exam/review/${attemptId}/`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load review:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [attemptId]);

  if (loading) return <div className="p-5 text-center"><h3>Reviewing performance...</h3></div>;
  if (!data) return <div className="p-5 text-center">Result not found.</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <div className="card p-4 mb-4 shadow-sm border-0">
        <h2 className="text-primary">📘 {data.exam_title}</h2>
        <h4 className="text-secondary">Final Score: {data.score}</h4>
      </div>

      {data.questions.map((q, i) => (
        <div key={i} className="card p-4 mb-3 border-0 shadow-sm" 
             style={{ backgroundColor: q.is_correct ? "#f0fff4" : "#fff5f5" }}>
          
          <h5 className="fw-bold mb-3">{i + 1}. {q.question}</h5>
          
          <div className="mb-2">
            <strong>Your Answer:</strong> 
            <span className={q.is_correct ? "text-success ms-2" : "text-danger ms-2"}>
              {q.selected_answer || "Not answered"}
            </span>
          </div>

          {!q.is_correct && (
            <div className="mb-2">
              <strong>Correct Answer:</strong> <span className="text-success ms-2">{q.correct_answer}</span>
            </div>
          )}

          {/* New Feature: Display Explanation */}
          {q.explanation && (
            <div className="mt-3 p-3 bg-white rounded border-start border-primary border-4">
              <small className="d-block fw-bold text-primary mb-1">💡 Learning Point:</small>
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      <button className="btn btn-primary w-100 mt-3 py-2" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}