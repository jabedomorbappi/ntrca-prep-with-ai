import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

// Operational Pages (Everything is now public)
import Home from "../pages/study/Home";
import SubTopics from "../pages/study/SubTopics";
import ExamSettings from "../pages/exam/ExamSettings";
import ExamPagePro from "../pages/exam/ExamPagePro";
import ResultPage from "../pages/exam/ResultPage";
import ExamHistoryPage from "../pages/exam/ExamHistoryPage";
import TopicsPage from "../pages/study/TopicsPage";
import StudyPage from "../pages/study/StudyPage";
// import ProfilePage from "../pages/user/ProfilePage"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/topics/:subjectId" element={<TopicsPage />} />
        <Route path="/subtopics/:topicId" element={<SubTopics />} />
        <Route path="/study/:subtopicId" element={<StudyPage />} />
        
        {/* All formerly protected pages are now open to the public */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/history" element={<ExamHistoryPage />} />
        <Route path="/exam-settings/:topicId/:subtopicId" element={<ExamSettings />} />
        <Route path="/exam/:examId" element={<ExamPagePro />} />
        <Route path="/result/:attemptId" element={<ResultPage />} />
        <Route path="/review/:attemptId" element={<ExamHistoryPage />} />
      </Route>

      {/* Redirect unknown routes back to Home instead of Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}