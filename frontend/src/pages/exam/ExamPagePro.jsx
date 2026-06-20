import React, { useCallback, useState, useEffect, useRef } from 'react';
import useTimer from "../../hooks/useTimer";
import { useExam } from "../../context/ExamContext";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function ExamPagePro() {
  const examContext = useExam() || {}; 
const { 
  exam = null, 
  setExam = () => {}, 
  answers = {}, 
  setAnswers = () => {}, 
  marked = {}, 
  setMarked = () => {}, 
  time, 
  setTime = () => {} 
} = examContext;

const [activeAttemptId, setActiveAttemptId] = useState(null);
const navigate = useNavigate();
const { examId } = useParams();
const hasStarted = useRef(false);

  // 1. SUBMIT EXAM
  const submitExam = useCallback(async () => {
    if (!activeAttemptId) return;

    try {
      await api.post("/api/exam/submit-attempt/", {
        attempt_id: activeAttemptId,
        exam_id: parseInt(examId),
        answers: answers 
      });
      navigate(`/result/${activeAttemptId}`);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert("Error submitting exam. Please try again.");
    }
  }, [answers, examId, navigate, activeAttemptId]);

  useEffect(() => {
  if (hasStarted.current || !examId) return;
  hasStarted.current = true;

  const startExam = async () => {
    try {
      const startRes = await api.post("/api/exam/start/", { exam_id: examId });
      setActiveAttemptId(startRes.data.attempt_id);
      
      const examRes = await api.get(`/api/exam/detail/${examId}/`);
      
      // Ensure we only set if data exists
      if (examRes.data) {
        setExam(examRes.data); 
      }
    } catch (err) {
      console.error("Error during startup:", err);
      hasStarted.current = false; // Reset so it can try again on error
    }
  };

  startExam();
}, [examId, setExam]);

  // 3. TIMER
  const finalMinutes = exam?.duration_minutes ?? (exam?.questions?.length * 0.6) ?? 30;

// Only hook the timer if exam is loaded to prevent errors
useTimer(finalMinutes * 60, setTime, submitExam);

  // 4. HANDLERS
  const selectAnswer = (qId, optionId) => setAnswers(prev => ({ ...prev, [qId]: optionId }));
  const toggleMark = (qId) => setMarked(prev => ({ ...prev, [qId]: !prev[qId] }));

  // 5. LOADING GUARD
  if (!exam || !exam.questions || exam.questions.length === 0) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f8fafc' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

  return (
    <div className="container-fluid py-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div className="row max-width-1200 mx-auto">
        <div className="col-md-9">
          <div className="card p-4 shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h2 className="h4 m-0 text-dark fw-bold">🔥 {exam.title}</h2>
              <div className="badge bg-danger fs-6 p-2 px-3 rounded-pill">
                ⏱️ {Math.floor(time / 60)}m {time % 60}s
              </div>
            </div>

            {exam.questions.map((q, index) => (
              <div key={q.id} className="p-3 mb-4 border rounded-3 bg-white">
                <h5 className="mb-3 text-slate-800 fw-semibold">Q{index + 1}. {q.question}</h5>
                {q.options?.map((opt) => (
                  <div key={opt.id} className="form-check p-2 mb-2 border rounded" style={{ borderColor: "#f1f5f9" }}>
                    <input
                      className="form-check-input ms-1"
                      type="radio"
                      name={`question-${q.id}`}
                      checked={answers[q.id] === opt.id}
                      onChange={() => selectAnswer(q.id, opt.id)}
                    />
                    <label className="form-check-label ps-3 text-secondary">{opt.text}</label>
                  </div>
                ))}
                <button className={`btn btn-sm ${marked[q.id] ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => toggleMark(q.id)}>
                  📌 {marked[q.id] ? "Unmark" : "Mark for Review"}
                </button>
              </div>
            ))}
            <button onClick={submitExam} className="btn btn-danger btn-lg w-100 fw-bold mt-3 py-3">
              📥 Submit Assessment
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-0 sticky-top" style={{ borderRadius: "16px", top: "20px" }}>
            <h5 className="text-muted mb-3 border-bottom pb-2 fw-bold">🎯 Progress Grid</h5>
            <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {exam.questions.map((q, i) => (
                <button key={q.id} onClick={() => window.scrollTo({ top: i * 350, behavior: "smooth" })} 
                  className={`btn ${answers[q.id] ? "btn-success" : marked[q.id] ? "btn-warning" : "btn-light border"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}