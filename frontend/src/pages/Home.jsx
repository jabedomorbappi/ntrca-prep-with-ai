import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api"; 

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/syllabus/subjects/");
        setSubjects(res.data);
      } catch (err) {
        console.error("Error loading subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // 🎯 Moved safely back inside the component boundary
  const getIcon = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("math")) return "🧮";
    if (lowerName.includes("science")) return "🧪";
    if (lowerName.includes("english")) return "🔤"; 
    if (lowerName.includes("bangla")) return "✍️";
    if (lowerName.includes("computer") || lowerName.includes("ict")) return "💻";
    if (lowerName.includes("history")) return "📜";
    if (lowerName.includes("geography")) return "🌍";
    if (lowerName.includes("religion") || lowerName.includes("islam")) return "🕌";
    if (lowerName.includes("physics")) return "⚡";
    if (lowerName.includes("chemistry")) return "🧪";
    
    return "📚";
  };

  // 🎯 Moved safely back inside the component boundary
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🔥 NTRCA Exam Preparation</h1>
        <p style={styles.subtitle}>Select a Subject to begin your preparation</p>
      </header>

      {loading ? (
        <div style={styles.emptyState}>Loading subjects...</div>
      ) : (
        <div style={styles.grid}>
          {subjects.map((sub) => (
            <div 
              key={sub.id} 
              style={styles.card} 
              onClick={() => navigate(`/topics/${sub.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={styles.iconWrapper}>{getIcon(sub.name)}</div>
              <h3 style={styles.cardTitle}>{sub.name}</h3>
              <p style={styles.cardText}>Click to view topics</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Styles object remains cleanly configured outside the operational logic
const styles = {
  container: { 
    padding: 40, 
    fontFamily: "'Segoe UI', sans-serif", 
    background: "#f5f7fb", 
    minHeight: "100vh" 
  },
  header: { 
    textAlign: "center", 
    marginBottom: 50 
  },
  title: { 
    fontSize: 36, 
    marginBottom: 10, 
    color: "#1a1a1a" 
  },
  subtitle: { 
    color: "#666", 
    fontSize: "1.2rem" 
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: 25,
    maxWidth: 1000,
    margin: "0 auto"
  },
  card: { 
    background: "#fff", 
    padding: 30, 
    borderRadius: 20, 
    cursor: "pointer", 
    textAlign: "center", 
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)", 
    transition: "0.3s" 
  },
  iconWrapper: { 
    fontSize: 50, 
    marginBottom: 15,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  cardTitle: { 
    fontSize: 20, 
    marginBottom: 5, 
    color: "#333" 
  },
  cardText: { 
    color: "#888", 
    fontSize: 14 
  },
  emptyState: { 
    padding: 20, 
    color: "#999", 
    textAlign: "center" 
  }
};