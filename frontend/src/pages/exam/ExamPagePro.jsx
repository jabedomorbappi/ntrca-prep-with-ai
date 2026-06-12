// import { useEffect, useCallback } from "react";
import React, { useCallback, useState, useEffect, useRef } from 'react';
import useTimer from "../../hooks/useTimer";
import { useExam } from "../../context/ExamContext";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api"; // Make sure the path is correct (../api.js)

export default function ExamPagePro() {
  console.log("COMPONENT MOUNTED");
  
  const { exam, setExam, answers, setAnswers, marked, setMarked, time, setTime } = useExam();
  const navigate = useNavigate();
  const { examId } = useParams();
  const hasStarted = useRef(false);





  // 1. SUBMIT EXAM
  const submitExam = useCallback(async () => {
    const attemptId = localStorage.getItem("attempt_id");
    if (!attemptId) return;

    try {
      await api.post("/api/exam/submit-attempt/", {
        attempt_id: parseInt(attemptId),
        exam_id: parseInt(examId),
        answers: answers 
      });
      localStorage.removeItem("attempt_id");
      navigate(`/result/${attemptId}`);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  }, [answers, examId, navigate]);





  // 2. LOAD EXAM & SYNC TIMER (The Engine)
  useEffect(() => {
    if (hasStarted.current) return;
    if (!examId) return;

    hasStarted.current = true;
    let isCancelled = false;

   const startExam = async () => {
    try {
        // 1. Create the attempt
        const startRes = await api.post("/api/exam/start/", { exam_id: examId });
        localStorage.setItem("attempt_id", startRes.data.attempt_id);
        
        // 2. Fetch the actual exam details to populate the UI
        console.log("Fetching exam details for ID:", examId);
        const examRes = await api.get(`/api/exam/detail/${examId}/`);
        
        // 3. Set state to finish loading
        console.log("Exam data loaded:", examRes.data);
        setExam(examRes.data); 
    } catch (err) {
        console.error("Error during startup:", err);
    }
};

    startExam();
    return () => { isCancelled = true; };
  }, [examId, setExam]);





  // -----------------------------
// 3. TIMER HOOK
  // Calculate based on API data
  const finalMinutes = exam?.duration_minutes || (exam?.questions?.length * 0.6) || 30;
  const durationInSeconds = finalMinutes * 60;

  // Pass it to the hook
  useTimer(durationInSeconds, setTime, submitExam);




  // 3. TIMER HOOK
  // const safeSetTime = typeof setTime === "function" ? setTime : () => {};
  // useTimer(time, safeSetTime, submitExam);

  // 4. UI HANDLERS
  const selectAnswer = (qId, optionId) => {
    setAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const toggleMark = (qId) => {
    setMarked(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // 5. LOADING GUARD
  // 5. LOADING GUARD
  console.log("GUARD CHECK. exam is:", exam); // See what is actually in 'exam'
  
  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f8fafc' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h4 className="text-secondary">Loading Exam Workspace...</h4>
          <p>Debug: {exam ? "Exam loaded but no questions" : "Exam not loaded"}</p>
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
        <div className="col-md-9">
          <div className="card p-4 shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h2 className="h4 m-0 text-dark fw-bold">🔥 {exam.title}</h2>
              <div className="badge bg-danger fs-6 p-2 px-3 rounded-pill">
                ⏱️ Time Left: {Math.floor(time / 60)}m {time % 60}s
              </div>
            </div>

            {exam.questions.map((q, index) => (
              <div key={q.id} className="p-3 mb-4 border rounded-3 bg-white shadow-none">
                <h5 className="mb-3 text-slate-800 fw-semibold">Q{index + 1}. {q.question}</h5>
                <div className="options-group mb-3">
                  {q.options?.map((opt) => (
                    <div key={opt.id} className="form-check p-2 rounded hover-bg-light transition-all mb-2" style={{ border: "1px solid #f1f5f9" }}>
                      <input
                        className="form-check-input ms-1"
                        type="radio"
                        name={`question-${q.id}`}
                        id={`opt-${opt.id}`}
                        checked={answers[q.id] === opt.id}
                        onChange={() => selectAnswer(q.id, opt.id)}
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
                >
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
              {exam.questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isMarked = marked[q.id];
                let btnClass = isAnswered ? "btn-success text-white" : isMarked ? "btn-warning" : "btn-light border";
                return (
                  <button key={q.id} onClick={() => window.scrollTo({ top: i * 360, behavior: "smooth" })} className={`btn ${btnClass}`}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}