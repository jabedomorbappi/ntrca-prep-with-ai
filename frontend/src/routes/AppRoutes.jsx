import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

// Authentication Pages
import Login from "../pages/Login";
import Register from "../pages/Register";

// Operational Pages
import Home from "../pages/Home";
import SubTopics from "../pages/SubTopics";
import ExamSettings from "../pages/ExamSettings";
import ExamPagePro from "../pages/ExamPagePro";
import ResultPage from "../pages/ResultPage";
import ExamHistoryPage from "../pages/ExamHistoryPage";
import TopicsPage from "../pages/TopicsPage";
import StudyPage from "../pages/StudyPage";
import ProfilePage from "../pages/ProfilePage"; 

// Global Application Layout Wrapper (Renders the dynamic Navbar cleanly for all views)
function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="container px-3 px-sm-4 py-4">
        <Outlet />
      </div>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 Public Authentication Portal Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🌐 MIXED / PUBLIC ACCESS BLOCK */}
      {/* These pages show the Navbar and are visible to EVERYONE, even without logging in */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/topics/:subjectId" element={<TopicsPage />} />
        <Route path="/subtopics/:topicId" element={<SubTopics />} />
        <Route path="/study/:subtopicId" element={<StudyPage />} />
        
        {/* 🔒 PROTECTED INDIVIDUAL DATA BLOCK */}
        {/* These specific paths are nested inside your ProtectedRoute validation filter */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<ExamHistoryPage />} />
          <Route path="/exam-settings/:topicId/:subtopicId" element={<ExamSettings />} />
          <Route path="/exam/:examId" element={<ExamPagePro />} />
          <Route path="/result/:attemptId" element={<ResultPage />} />
          <Route path="/review/:attemptId" element={<ExamHistoryPage />} />
        </Route>
      </Route>

      {/* 🚨 Catch-all unhandled fallback routing path */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}