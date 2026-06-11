import { createContext, useContext, useState } from "react";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  // 1. Exam state: stores the exam object (questions, title, etc.)
  const [exam, setExam] = useState(null);
  
  // 2. Current index: tracks which question is being viewed
  const [current, setCurrent] = useState(0);

  // 3. User progress states
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});

  // 4. Timer state: Initialize with 30 minutes (30 * 60)
  // You can change this to 6 * 60 if you want to default to 6 minutes
  const [time, setTime] = useState(60 * 30); 

  return (
    <ExamContext.Provider
      value={{
        exam,
        setExam,
        current,
        setCurrent,
        answers,
        setAnswers,
        marked,
        setMarked,
        time,
        setTime, // ✅ Now consistently named 'setTime'
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

// Custom hook to use the exam context easily
export const useExam = () => useContext(ExamContext);