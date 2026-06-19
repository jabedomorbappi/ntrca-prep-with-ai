import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; 

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Fetches from your cleaned, auth-free public API
        const res = await api.get(`/api/exam/result/${attemptId}/`);
        setResult(res.data);
      } catch (err) {
        console.error("Result fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="p-5 text-center"><h3>Loading Assessment Summary...</h3></div>;
  if (!result) return <div className="p-5 text-center text-danger">Result data not found.</div>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      {/* Header Summary */}
      <div className="card p-4 shadow-sm border-0 mb-4" style={{ borderRadius: "15px" }}>
        <h2 className="text-primary fw-bold">{result.exam_title}</h2>
        <hr />
        <div className="d-flex gap-4">
          <p><strong>Score:</strong> {result.score}</p>
          <p className="text-success"><strong>Correct:</strong> {result.correct}</p>
          <p className="text-danger"><strong>Wrong:</strong> {result.wrong}</p>
        </div>
      </div>

      {/* Questions Review */}
      {result.questions?.map((q, index) => (
        <div key={q.id} className="card p-4 mb-3 shadow-sm border-0" style={{ borderRadius: "15px" }}>
          <h5 className="mb-3 fw-bold">{index + 1}. {q.question}</h5>
          
          <div className="d-flex flex-column gap-2">
            {q.options?.map((opt) => {
              const isSelected = opt.text === q.selected_answer;
              const isCorrect = opt.text === q.correct_answer;
              
              // Dynamic styling based on answer correctness
              let btnClass = "btn btn-light border";
              if (isSelected && q.is_correct) btnClass = "btn btn-success text-white";
              else if (isSelected && !q.is_correct) btnClass = "btn btn-danger text-white";
              else if (isCorrect) btnClass = "btn btn-outline-success border-2";

              return (
                <div key={opt.id} className={`${btnClass} text-start p-2 rounded`}>
                  {opt.text} {isSelected && <small className="fw-bold ms-2">(Your choice)</small>}
                </div>
              );
            })}
          </div>

          {/* Educational Explanation */}
          {q.explanation && (
            <div className="mt-3 p-3 bg-light rounded border-start border-primary border-4">
              <small className="d-block fw-bold text-primary mb-1">💡 Explanation:</small>
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      <button className="btn btn-primary w-100 mt-3 py-2 fw-bold" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}