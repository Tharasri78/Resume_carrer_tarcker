import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import JobTracker from "./pages/JobTracker";
import ATSAnalyzer from "./pages/ATSAnalyzer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED LAYOUT ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/jobs" element={<JobTracker />} />
        <Route path="/ats-analyzer" element={<ATSAnalyzer />} />
      </Route>
    </Routes>
  );
}