import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Change this line:
import api from "../../api"; // Assuming your api.js is in the 'src' folder

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/api/exam/review/${attemptId}/`);
        console.log("DEBUG [API DATA]:", res.data); 
        setResult(res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="p-5 text-center"><h3>Loading Results...</h3></div>;
  if (!result) return <div className="p-5 text-center text-danger">Result not found.</div>;


  const styles = {
    card: { border: "1px solid #ddd", borderRadius: "15px", padding: "20px", marginBottom: "20px", backgroundColor: "#fff" },
    btnCorrect: { backgroundColor: "#198754", color: "white", padding: "10px", width: "100%", textAlign: "left", marginBottom: "5px", borderRadius: "5px" },
    btnWrong: { backgroundColor: "#dc3545", color: "white", padding: "10px", width: "100%", textAlign: "left", marginBottom: "5px", borderRadius: "5px" },
    btnDefault: { backgroundColor: "#f8f9fa", padding: "10px", width: "100%", textAlign: "left", marginBottom: "5px", borderRadius: "5px", border: "1px solid #ccc" }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      {/* Header */}
      <div style={styles.card}>
        <h2 style={{ color: "#0d6efd" }}>{result.exam_title}</h2>
        <hr />
        <div style={{ display: "flex", gap: "20px" }}>
           <p><strong>Score:</strong> {result.score}</p>
           <p style={{ color: "green" }}><strong>Correct:</strong> {result.correct}</p>
           <p style={{ color: "red" }}><strong>Wrong:</strong> {result.wrong}</p>
        </div>
      </div>

      {/* Questions */}
      {result.questions && result.questions.map((q, index) => (
        <div key={q.id} style={styles.card}>
          <h5>{index + 1}. {q.question}</h5>
          
          <div style={{ marginTop: "15px" }}>
            {q.options && q.options.map((opt) => {
              const isSelected = opt.text === q.selected_answer;
              const isCorrectOption = opt.text === q.correct_answer;
              
              let style = styles.btnDefault;
              if (isSelected && q.is_correct) style = styles.btnCorrect;
              else if (isSelected && !q.is_correct) style = styles.btnWrong;
              else if (isCorrectOption) style = { ...styles.btnDefault, border: "2px solid green" };

              return (
                <div key={opt.id} style={style}>
                  {opt.text} {isSelected && <span>(Your choice)</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button className="btn btn-primary w-100 mt-3" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}