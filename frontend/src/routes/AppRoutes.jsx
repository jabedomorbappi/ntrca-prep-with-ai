import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

// Authentication Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RequestReset from "../pages/auth/RequestReset"; // Added
import ResetConfirm from "../pages/auth/ResetConfirm"; // Added

// Operational Pages
import Home from "../pages/study/Home";
import SubTopics from "../pages/study/SubTopics";
import ExamSettings from "../pages/exam/ExamSettings";
import ExamPagePro from "../pages/exam/ExamPagePro";
import ResultPage from "../pages/exam/ResultPage"; // Updated path
import ExamHistoryPage from "../pages/exam/ExamHistoryPage";
import TopicsPage from "../pages/study/TopicsPage";
import StudyPage from "../pages/study/StudyPage";
import ProfilePage from "../pages/user/ProfilePage"; 
import AppLayout from "../layouts/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 Public Authentication Portal Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<RequestReset />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetConfirm />} />

    <Route element={<AppLayout />}></Route>

      {/* 🌐 MIXED / PUBLIC ACCESS BLOCK */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/topics/:subjectId" element={<TopicsPage />} />
        <Route path="/subtopics/:topicId" element={<SubTopics />} />
        <Route path="/study/:subtopicId" element={<StudyPage />} />
        
        {/* 🔒 PROTECTED INDIVIDUAL DATA BLOCK */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<ExamHistoryPage />} />
          <Route path="/exam-settings/:topicId/:subtopicId" element={<ExamSettings />} />
          <Route path="/exam/:examId" element={<ExamPagePro />} />
          <Route path="/result/:attemptId" element={<ResultPage />} />
          <Route path="/review/:attemptId" element={<ExamHistoryPage />} />
        </Route>
      </Route>

      {/* 🚨 Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}