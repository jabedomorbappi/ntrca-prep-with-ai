import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; 

export default function ExamSettings() {
  const { topicId, subtopicId } = useParams();
  const navigate = useNavigate();

  const [useQuestionBank, setUseQuestionBank] = useState(true);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [timer, setTimer] = useState(6);
  const [negative, setNegative] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Study Mode Features
  const [questionCount, setQuestionCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    const calculatedTime = Math.round(numQuestions * 0.6);
    setTimer(calculatedTime);
  }, [numQuestions]);

  // Fetch count on load
// Fetch count on load
  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoadingCount(true);
        // CHANGE THIS LINE:
        const res = await api.get(`/api/exam/subtopic-stats/${subtopicId}/`);
        
        console.log("API Stats Response:", res.data);
        
        // Assuming your backend returns a list of exams, 
        // and you want the count of questions available.
        // If 'res.data' is a list of exams, you might want the sum of 'questions' field.
        const totalQuestions = res.data.reduce((sum, exam) => sum + (exam.questions || 0), 0);
        setQuestionCount(totalQuestions);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoadingCount(false);
      }
    };
    fetchCount();
  }, [subtopicId]);

  const startExam = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await api.post("/api/exam/generate/", {
        topic_id: topicId,
        subtopic_id: subtopicId,
        num_questions: numQuestions,
        difficulty: difficulty,
        timer_minutes: timer,
        negative_marking: negative,
        use_question_bank: useQuestionBank,
      });

      const examId = res.data?.exam_id || res.data?.snapshot_id;
      if (!examId || examId === "null" || examId === "undefined") {
        setErrorMsg("Failed to initialize active mock test sheet workspace.");
        return;
      }
      navigate(`/exam/${examId}`);
    } catch (err) {
      const backError = err.response?.data?.error || "Error contacting preparation gateway.";
      setErrorMsg(backError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>⚙️ Exam Config (NTRCA)</h2>
          <p style={styles.subtitle}>Customize your syllabus mock test sheet workspace parameters below.</p>
        </div>

        {/* STUDY MODE ENTRY POINT */}
        <div style={{...styles.section, background: "#f0f9ff", padding: "15px", borderRadius: "8px", border: "1px solid #bae6fd"}}>
          <label style={{...styles.label, marginBottom: "5px"}}>Database Status</label>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span style={{fontSize: "14px", fontWeight: "600", color: "#0369a1"}}>
              {loadingCount ? "Checking bank..." : `${questionCount} questions available in bank`}
            </span>
            <button 
              onClick={() => navigate(`/study/${subtopicId}`)}
              style={{background: "#0284c7", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer"}}
            >
              📖 Study Mode
            </button>
          </div>
        </div>

        {/* ERROR BOX */}
        {errorMsg && (
          <div style={styles.errorContainer}>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>⚠️ Configuration Warning</span>
            <p style={styles.errorText}>{errorMsg}</p>
            {useQuestionBank && errorMsg.includes("database") && (
              <button onClick={() => { setUseQuestionBank(false); setErrorMsg(""); }} style={styles.switchButton}>
                Switch to AI Generated Mode instead 🚀
              </button>
            )}
          </div>
        )}

        {/* QUESTION SOURCE TABS */}
        <div style={styles.section}>
          <label style={styles.label}>Question Source Pool</label>
          <div style={styles.sourceSelector}>
            <button onClick={() => { setUseQuestionBank(true); setErrorMsg(""); }} style={{...styles.sourceTab, background: useQuestionBank ? "#2563eb" : "#f3f4f6", color: useQuestionBank ? "#ffffff" : "#4b5563"}}>
              📚 Stored Question Bank
            </button>
            <button onClick={() => { setUseQuestionBank(false); setErrorMsg(""); }} style={{...styles.sourceTab, background: !useQuestionBank ? "#10b981" : "#f3f4f6", color: !useQuestionBank ? "#ffffff" : "#4b5563"}}>
              🤖 Fresh AI Generation
            </button>
          </div>
        </div>

        {/* NUMBER OF QUESTIONS */}
        <div style={styles.section}>
          <label style={styles.label}>Number of Questions</label>
          <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} style={styles.inputSelect}>
            {[10, 20, 30, 40, 50].map((n) => <option key={n} value={n}>{n} MCQ Questions</option>)}
          </select>
        </div>

        {/* DIFFICULTY */}
        <div style={styles.section}>
          <label style={styles.label}>Difficulty Standard</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={styles.inputSelect}>
            <option value="easy">Easy Level</option>
            <option value="medium">Medium Level (Standard)</option>
            <option value="hard">Hard Level (Complex)</option>
          </select>
        </div>

        {/* TIMER */}
        <div style={styles.section}>
          <label style={styles.label}>Timer Limit (minutes)</label>
          <input type="number" value={timer} onChange={(e) => setTimer(Number(e.target.value))} style={styles.inputField} min="1" max="180" />
        </div>

        {/* NEGATIVE MARKING */}
        <div style={styles.sectionRow}>
          <div>
            <label style={{ ...styles.label, marginBottom: "2px" }}>Negative Penalty</label>
            <span style={{ fontSize: "11px", color: "#6b7280", display: "block" }}>Deducts -0.25 on wrong answers</span>
          </div>
          <input type="checkbox" checked={negative} onChange={(e) => setNegative(e.target.checked)} style={styles.checkbox} />
        </div>
        
        <button 
          onClick={startExam} 
          style={{...styles.button, background: useQuestionBank ? "#2563eb" : "#10b981"}} 
          disabled={loading}
        >
          {loading ? "Preparing Exam System..." : "🚀 Initialize Exam Workspace"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f3f4f6", fontFamily: "sans-serif", padding: "20px" },
  card: { width: "440px", background: "#ffffff", padding: "30px", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  header: { marginBottom: "25px", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#1f2937", margin: 0 },
  subtitle: { fontSize: "12px", color: "#6b7280", marginTop: "5px" },
  section: { marginBottom: "20px", display: "flex", flexDirection: "column" },
  sectionRow: { marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", padding: "12px 15px", borderRadius: "8px", border: "1px solid #e5e7eb" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" },
  sourceSelector: { display: "flex", gap: "10px", marginBottom: "8px" },
  sourceTab: { flex: 1, padding: "12px", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  inputSelect: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#374151", outline: "none" },
  inputField: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#374151", outline: "none" },
  checkbox: { width: "18px", height: "18px", cursor: "pointer" },
  button: { width: "100%", padding: "14px", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
  errorContainer: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "15px", borderRadius: "8px", marginBottom: "20px" },
  errorText: { fontSize: "12px", margin: "5px 0 10px 0" },
  switchButton: { background: "#991b1b", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }
};