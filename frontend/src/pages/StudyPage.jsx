import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; 

export default function StudyPage() {
  const { subtopicId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/study/questions/${subtopicId}/`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subtopicId]);

  if (loading) return <div style={styles.center}>Loading Questions...</div>;
  if (questions.length === 0) return <div style={styles.center}>No questions found in this module.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerArea}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        <h2 style={styles.mainTitle}>Study Mode: Total {questions.length} Questions</h2>
      </div>

      <div style={styles.list}>
        {questions.map((q, index) => (
          <StudyQuestionItem key={q.id} question={q} index={index} />
        ))}
      </div>
    </div>
  );
}

function StudyQuestionItem({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div style={styles.card}>
      <div style={styles.questionMeta}>Question {index + 1}</div>
      <h3 style={styles.questionText}>{question.question}</h3>

      <div style={styles.optionsGrid}>
        {question.options.map((opt) => (
          <div 
            key={opt.id} 
            style={{
              ...styles.option,
              border: showAnswer && opt.is_correct ? "2px solid #22c55e" : "1px solid #d1d5db",
              backgroundColor: showAnswer && opt.is_correct ? "#f0fdf4" : "#ffffff"
            }}
          >
            {opt.text}
            {showAnswer && opt.is_correct && <span style={styles.correctBadge}>✓ Correct</span>}
          </div>
        ))}
      </div>
      
      <div style={styles.buttonGroup}>
        <button onClick={() => setShowAnswer(!showAnswer)} style={styles.btnAnswer}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
        <button onClick={() => setShowExplanation(!showExplanation)} style={styles.btnExp}>
          {showExplanation ? "Hide Explanation" : "Show Explanation"}
        </button>
      </div>

      {showExplanation && (
        <div style={styles.expBox}>
          <strong>Explanation:</strong> {question.explanation || "No explanation provided."}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px 20px", background: "#f3f4f6", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
  headerArea: { width: "100%", maxWidth: "600px", display: "flex", alignItems: "center", marginBottom: "20px", gap: "20px" },
  mainTitle: { margin: 0, color: "#1f2937", fontSize: "18px" },
  list: { width: "100%", maxWidth: "600px" },
  card: { background: "white", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  questionMeta: { fontSize: "12px", color: "#6b7280", marginBottom: "5px", textTransform: "uppercase" },
  questionText: { fontSize: "18px", marginBottom: "20px", color: "#111827", fontWeight: "500" },
  optionsGrid: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  option: { padding: "12px 15px", borderRadius: "8px", fontSize: "15px", border: "1px solid #d1d5db", display: "flex", justifyContent: "space-between" },
  correctBadge: { color: "#22c55e", fontWeight: "bold", fontSize: "14px" },
  buttonGroup: { display: "flex", gap: "10px" },
  btnAnswer: { padding: "10px 16px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", cursor: "pointer", flex: 1 },
  btnExp: { padding: "10px 16px", borderRadius: "8px", border: "none", background: "#6b7280", color: "white", cursor: "pointer", flex: 1 },
  expBox: { marginTop: "15px", padding: "15px", background: "#f9fafb", borderRadius: "8px", fontSize: "14px", color: "#374151", border: "1px solid #e5e7eb" },
  backBtn: { background: "#e5e7eb", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  center: { textAlign: "center", marginTop: "100px", fontSize: "18px", color: "#6b7280" }
};