import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; 

export default function SubTopics() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [subtopics, setSubtopics] = useState([]);
  const [snapshots, setSnapshots] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (topicId) {
      fetchSubtopicsAndSnapshots();
    }
  }, [topicId]);

  const fetchSubtopicsAndSnapshots = async () => {
    try {
      setLoading(true);
      const subtopicsRes = await api.get(`/api/syllabus/subtopics/${topicId}/`);
      const subtopicsList = subtopicsRes.data;
      setSubtopics(subtopicsList);

      const snapshotMap = {};
      await Promise.all(
        subtopicsList.map(async (sub) => {
          try {
            // Using your new active-snapshot endpoint
            const res = await api.get(`/api/exam/active-snapshot/${sub.id}/`);
            if (res.data) {
              snapshotMap[sub.id] = res.data;
            }
          } catch (err) {
            console.error(`No active snapshot for subtopic ${sub.id}`);
          }
        })
      );
      setSnapshots(snapshotMap);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topNav}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Subjects
        </button>
      </div>

      <header style={styles.header}>
        <h2 style={styles.title}>📚 Chapter Modules</h2>
        <p style={styles.subtitle}>Select a module to continue your preparation</p>
      </header>

      {loading ? (
        <div style={styles.loading}>Loading study modules...</div>
      ) : (
        <div style={styles.grid}>
          {subtopics.map((st) => {
            const snapshotObj = snapshots[st.id]; 
            const isHovered = hoveredCard === st.id;

            return (
              <div 
                key={st.id} 
                style={{
                  ...styles.card,
                  transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)" : styles.card.boxShadow
                }}
                onMouseEnter={() => setHoveredCard(st.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.icon}>🎯</div>
                  <h3 style={styles.cardTitle}>{st.name}</h3>
                </div>
                
                <div style={styles.actions}>
                  {/* 1. Start New Exam (Always Available) */}
                  <button 
                    onClick={() => navigate(`/exam-settings/${topicId}/${st.id}`)} 
                    style={{...styles.btn, ...styles.startBtn}}
                  >
                    🚀 Start New Exam
                  </button>

                  {/* 2. Resume Session (Only Available if active snapshot exists) */}
                  {snapshotObj && (
                    <button 
                      onClick={() => navigate(`/exam/${snapshotObj.id}`)}
                      style={{...styles.btn, ...styles.resumeBtn}}
                    >
                      🟢 Resume Previous Session
                    </button>
                  )}

                  {/* 3. View Results (Always Available) */}
                  <button 
                    onClick={() => navigate(`/history?subtopic=${st.id}`)} 
                    style={styles.historyBtn}
                  >
                    📊 View Past Results
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px 20px", background: "#f8fafc", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto" },
  topNav: { marginBottom: "20px" },
  backBtn: { padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "600" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "2.2rem", color: "#1e293b", marginBottom: "8px" },
  subtitle: { color: "#64748b", fontSize: "1.1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" },
  card: { background: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", transition: "transform 0.3s ease" },
  cardHeader: { marginBottom: "20px" },
  icon: { fontSize: "2rem", marginBottom: "12px" },
  cardTitle: { fontSize: "1.25rem", color: "#334155", margin: 0 },
  actions: { display: "flex", flexDirection: "column", gap: "10px" },
  btn: { padding: "12px", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", transition: "0.2s" },
  startBtn: { background: "#3b82f6", color: "white" },
  resumeBtn: { background: "#10b981", color: "white" },
  historyBtn: { background: "#f1f5f9", color: "#475569", border: "none", padding: "10px", borderRadius: "10px", fontWeight: "500", cursor: "pointer" },
  loading: { textAlign: "center", marginTop: "50px", color: "#64748b" }
};