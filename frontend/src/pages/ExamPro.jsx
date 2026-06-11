import { useEffect, useCallback } from "react";
import useTimer from "../hooks/useTimer";
import { useExam } from "../context/ExamContext";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api"; 

export default function ExamPro() {
  const {
    exam, setExam,
    answers, setAnswers,
    marked, setMarked,
    time, setTime 
  } = useExam();

  const navigate = useNavigate();
  const { examId } = useParams();

  // -----------------------------
  // SUBMIT EXAM (Submits Option IDs to Django)
  // -----------------------------
  const submitExam = useCallback(async () => {
    const attemptId = localStorage.getItem("attempt_id");
    if (!attemptId) return;

    try {
      await api.post("/api/exam/submit-attempt/", {
        attempt_id: parseInt(attemptId),
        exam_id: parseInt(examId),
        answers: answers // Sends { "question_id": selected_option_id }
      });

      localStorage.removeItem("attempt_id");
      navigate(`/result/${attemptId}`);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  }, [answers, examId, navigate]);

  // -----------------------------
  // LOAD EXAM & SYNC TIMER
  // -----------------------------
  useEffect(() => {
    const startExam = async () => {
      try {
        // 1. Start Attempt in Backend
        const res = await api.post("/api/exam/start/", { exam_id: examId });
        localStorage.setItem("attempt_id", res.data.attempt_id);

        // 2. Fetch Detailed Exam Data
        const examRes = await api.get(`/api/exam/detail/${examId}/`);
        setExam(examRes.data);

        // 3. Sync time cleanly from backend response
        if (examRes.data.duration_minutes) {
          setTime(examRes.data.duration_minutes * 60); // Convert to seconds for timer hook
        }
      } catch (err) {
        console.error("START ERROR:", err.response?.data || err.message);
      }
    };

    if (examId) {
      startExam();
    }
  }, [examId, setExam, setTime]);

  // -----------------------------
  // TIMER HOOK
  // -----------------------------
  useTimer(time, null, submitExam);

  // -----------------------------
  // UI HANDLERS
  // -----------------------------
  const selectAnswer = (qId, optionId) => {
    setAnswers(prev => ({ ...prev, [qId]: optionId })); // 🎯 Crucial Fix: Saving optionId integer instead of text string
  };

  const toggleMark = (qId) => {
    setMarked(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // -----------------------------
  // LOADING GUARD
  // -----------------------------
  if (!exam?.questions?.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f8fafc' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h4 className="text-secondary">Loading Exam Workspace...</h4>
        </div>
      </div>
    );
  }

  // -----------------------------
  // UI LAYOUT RENDER
  // -----------------------------
  return (
    <div className="container-fluid py-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div className="row max-width-1200 mx-auto">
        
        {/* LEFT SIDE - QUESTIONS PACK */}
        <div className="col-md-9">
          <div className="card p-4 shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h2 className="h4 m-0 text-dark fw-bold">🔥 {exam.title}</h2>
              <div className="badge bg-danger fs-6 p-2, px-3 rounded-pill">
                ⏱️ Time Left: {Math.floor(time / 60)}m {time % 60}s
              </div>
            </div>

            {exam.questions.map((q, index) => (
              <div key={q.id} className="p-3 mb-4 border rounded-3 bg-white shadow-none">
                <h5 className="mb-3 text-slate-800 fw-semibold">
                  Q{index + 1}. {q.question}
                </h5>

                <div className="options-group mb-3">
                  {q.options?.map((opt) => (
                    <div key={opt.id} className="form-check p-2 rounded hover-bg-light transition-all mb-2" style={{ border: "1px solid #f1f5f9" }}>
                      <input
                        className="form-check-input ms-1"
                        type="radio"
                        name={`question-${q.id}`}
                        id={`opt-${opt.id}`}
                        checked={answers[q.id] === opt.id} // Evaluates clean key matching
                        onChange={() => selectAnswer(q.id, opt.id)} // Saves the clean option.id
                      />
                      <label className="form-check-label ps-3 text-secondary w-100 cursor-pointer" htmlFor={`opt-${opt.id}`}>
                        {opt.text}
                      </label>
                    </div>
                  ))}
                </div>

                <button 
                  className={`btn btn-sm ${marked[q.id] ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => toggleMark(q.id)}
                  style={{ borderRadius: "8px" }}
                >
                  📌 {marked[q.id] ? "Unmark" : "Mark for Review"}
                </button>
              </div>
            ))}

            <button
              onClick={submitExam}
              className="btn btn-danger btn-lg w-100 fw-bold mt-3 py-3"
              style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(220, 53, 69, 0.2)" }}
            >
              📥 Submit Assessment
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - QUESTION PALETTE */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-0 sticky-top" style={{ borderRadius: "16px", top: "20px" }}>
            <h5 className="text-muted mb-3 border-bottom pb-2fw-bold">🎯 Progress Grid</h5>
            <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {exam.questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isMarked = marked[q.id];

                let btnClass = "btn-light text-secondary border";
                if (isAnswered) btnClass = "btn-success text-white border-0";
                else if (isMarked) btnClass = "btn-warning text-dark border-0";

                return (
                  <button
                    key={q.id}
                    onClick={() => window.scrollTo({ top: i * 360, behavior: "smooth" })}
                    className={`btn d-flex align-items-center justify-content-center p-2 fw-semibold ${btnClass}`}
                    style={{ height: "45px", borderRadius: "10px", fontSize: "0.95rem" }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-2 border-top fs-7 text-muted">
              <div className="d-flex align-items-center mb-1"><span className="badge bg-success me-2">&nbsp;</span> Answered</div>
              <div className="d-flex align-items-center mb-1"><span className="badge bg-warning me-2">&nbsp;</span> Flagged Review</div>
              <div className="d-flex align-items-center"><span className="badge bg-light border me-2">&nbsp;</span> Unattended</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}