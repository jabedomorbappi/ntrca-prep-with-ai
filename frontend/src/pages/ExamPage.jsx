import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; 

export default function ExamPage() {
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      const res = await api.get(`/api/exam/detail/${examId}/`);
      setExam(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const selectAnswer = (qid, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: optionId,
    }));
  };

  if (!exam) return <h2>Loading...</h2>;

  const q = exam.questions[current];

  return (
    <div style={{ padding: "20px" }}>

      <h2>{exam.title}</h2>

      {/* QUESTION */}
      <div style={{ marginTop: "20px" }}>
        <h3>Q{current + 1}. {q.question}</h3>

        {q.options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => selectAnswer(q.id, opt.id)}
            style={{
              padding: "10px",
              margin: "8px 0",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: answers[q.id] === opt.id ? "#d1f5d3" : "#fff",
            }}
          >
            {opt.text}
          </div>
        ))}
      </div>

      {/* NAV */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={current === 0}
          onClick={() => setCurrent((p) => p - 1)}
        >
          Prev
        </button>

        <button
          disabled={current === exam.questions.length - 1}
          onClick={() => setCurrent((p) => p + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}