import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api"; // Import your simplified api instance

export default function ExamHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        // No more token checking or Authorization headers needed
        const response = await api.get("/api/history/"); 

        setHistory(response.data);
      } catch (err) {
        console.error("Failed to retrieve performance history:", err);
        setError("Could not retrieve assessment logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5">
        <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
          <span className="visually-hidden">Compiling Performance Records...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .history-card {
          border: none;
          border-radius: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        }
        .history-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.06);
        }
      `}</style>

      <div className="container py-2 animate-fade-in">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-2 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-1">Performance Records</h2>
            <p className="text-muted small mb-md-0">Track your verified assessment performance history across subtopics</p>
          </div>
          <Link to="/" className="btn btn-outline-primary btn-sm rounded-3 fw-semibold px-3 py-2">
            ➕ Take New Exam
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 small py-2 px-3 text-center fw-medium" role="alert">
            ⚠️ {error}
          </div>
        )}

        {!error && history.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4 bg-white mt-4">
            <div className="card-body">
              <div className="fs-1 text-muted mb-3">📊</div>
              <h4 className="fw-bold text-dark mb-2">No Historical Data Found</h4>
              <p className="text-muted small mx-auto mb-4" style={{ maxWidth: "400px" }}>
                You haven't completed any assessments yet. Choose a topic from the home catalog to get started.
              </p>
              <Link to="/" className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm">
                Explore Available Modules
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {history.map((attempt) => {
              const percentage = Math.round((attempt.score / attempt.total_questions) * 100) || 0;
              const hasPassed = percentage >= 50;

              return (
                <div className="col-12" key={attempt.id}>
                  <div className="card history-card p-3 bg-white border">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-md-6 col-lg-7 text-start">
                        <span className="badge bg-light text-primary border border-primary-subtle rounded-pill small px-2.5 py-1 fw-bold text-uppercase mb-2 d-inline-block">
                          {attempt.subtopic_name || "General Evaluation"}
                        </span>
                        <h5 className="fw-bold text-dark mb-1 text-capitalize">
                          {attempt.topic_name || "Comprehensive Practice Examination"}
                        </h5>
                        <p className="text-muted mb-0 small">
                          📅 {new Date(attempt.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                      </div>
                      <div className="col-12 col-sm-7 col-md-4 col-lg-3 text-start">
                        <div className="d-flex justify-content-between mb-1 small fw-bold text-muted">
                          <span>Accuracy</span>
                          <span className={hasPassed ? "text-success" : "text-danger"}>{percentage}%</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: "8px" }}>
                          <div className={`progress-bar rounded-pill ${hasPassed ? "bg-success" : "bg-danger"}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-5 col-md-2 text-sm-end text-start">
                        <Link to={`/review/${attempt.attempt_id}`} className="btn btn-light btn-sm border rounded-3 w-100 py-2 fw-bold">
                          🔍 Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}