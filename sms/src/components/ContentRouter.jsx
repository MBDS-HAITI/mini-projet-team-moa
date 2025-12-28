import { Routes, Route, Navigate } from "react-router-dom";
import Students from "./pages/Students.jsx";
import Grades from "./pages/Grades.jsx";
import Courses from "./pages/Courses.jsx";
import About from "./pages/About.jsx";
import Users from "./pages/Users.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Login from "./Login.jsx";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function ContentRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
      
      <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
      <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default ContentRouter;