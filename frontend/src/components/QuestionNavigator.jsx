export default function QuestionNavigator({
  questions,
  current,
  setCurrent,
  answers,
  marked
}) {
  return (
    <div style={{ width: "300px" }}>
      <h3>Questions</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "5px"
      }}>
        {questions.map((q, i) => {
          let bg = "#eee";

          if (answers[q.id]) bg = "#a5d8ff";
          if (marked[q.id]) bg = "#ffd43b";
          if (i === current) bg = "#74c0fc";

          return (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              style={{
                padding: "8px",
                background: bg,
                border: "1px solid #333",
                cursor: "pointer"
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}