import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; 

export default function ExamReview() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get(`/api/exam/review/${attemptId}/`);
    setData(res.data);
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📘 {data.exam_title}</h2>
      <h3>Score: {data.score}</h3>

      {data.questions.map((q, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            margin: "15px 0",
            padding: 15,
            borderRadius: 8,
            background: q.is_correct ? "#e6ffe6" : "#ffe6e6"
          }}
        >
          <h3>Q{i + 1}. {q.question}</h3>

          <p>
            <b>Your Answer:</b> {q.selected_answer || "Not answered"}
          </p>

          <p style={{ color: "green" }}>
            <b>Correct Answer:</b> {q.correct_answer}
          </p>

          <p>
            Status: {q.is_correct ? "✅ Correct" : "❌ Wrong"}
          </p>
        </div>
      ))}
    </div>
  );
}