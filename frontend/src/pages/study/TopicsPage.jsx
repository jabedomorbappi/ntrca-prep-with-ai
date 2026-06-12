import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; 

export default function TopicsPage() {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get(`/api/syllabus/topics/${subjectId}/`);
        setTopics(res.data);
      } catch (err) {
        console.error("Error loading topics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [subjectId]);

  // Helper to get descriptive icons based on topic name keywords
  const getIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("ai") || lowerName.includes("artificial")) return "🤖";
    if (lowerName.includes("network")) return "🌐";
    if (lowerName.includes("data") || lowerName.includes("database")) return "💾";
    if (lowerName.includes("os") || lowerName.includes("operating")) return "💻";
    if (lowerName.includes("program")) return "⚙️";
    if (lowerName.includes("algo") || lowerName.includes("dsa")) return "📊";
    if (lowerName.includes("security")) return "🔒";
    if (lowerName.includes("web")) return "🌍";
    return "🎯"; // Default icon
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Browse Topics</h1>
        <p style={styles.subtitle}>Select a topic to explore its subtopics and start practicing.</p>
      </header>
      
      {loading ? (
        <div style={styles.loading}>
          <div className="spinner-border text-primary" role="status"></div>
          <p style={{ marginTop: "15px", color: "#666" }}>Loading your study topics...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {topics.map((topic) => (
            <div 
              key={topic.id} 
              style={styles.card} 
              onClick={() => navigate(`/subtopics/${topic.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.iconContainer}>
                <span style={{ fontSize: "2rem" }}>{getIcon(topic.name)}</span>
              </div>
              <h3 style={styles.cardTitle}>{topic.name}</h3>
              <p style={styles.cardText}>Deep dive into this topic</p>
              <div style={styles.viewMore}>View Subtopics →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    padding: "40px 20px", 
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
    background: "#f8fafc", 
    minHeight: "100vh" 
  },
  header: { 
    textAlign: "center", 
    marginBottom: "50px" 
  },
  backBtn: { 
    padding: "8px 18px", 
    background: "#e2e8f0", 
    border: "none", 
    borderRadius: "20px", 
    cursor: "pointer", 
    fontWeight: "600",
    color: "#475569",
    marginBottom: "20px"
  },
  title: { 
    fontSize: "2.5rem", 
    color: "#1e293b", 
    marginBottom: "10px" 
  },
  subtitle: { 
    color: "#64748b", 
    fontSize: "1.1rem" 
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
    gap: "25px",
    maxWidth: "1100px",
    margin: "0 auto"
  },
  card: { 
    background: "#ffffff", 
    padding: "30px", 
    borderRadius: "20px", 
    cursor: "pointer", 
    textAlign: "center", 
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)", 
    border: "1px solid #f1f5f9",
    transition: "all 0.3s ease"
  },
  iconContainer: {
    width: "70px",
    height: "70px",
    background: "#eff6ff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px"
  },
  cardTitle: { 
    fontSize: "1.3rem", 
    color: "#0f172a", 
    marginBottom: "10px" 
  },
  cardText: { 
    color: "#94a3b8", 
    fontSize: "0.95rem",
    marginBottom: "15px"
  },
  viewMore: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: "0.9rem"
  },
  loading: { 
    textAlign: "center", 
    marginTop: "100px" 
  }
};