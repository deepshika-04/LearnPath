import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiagnosticTest from './pages/DiagnosticTest';
import LearningPath from './pages/LearningPath';
import Resources from './pages/Resources';
import Progress from './pages/Progress';
import StudyPlan from './pages/StudyPlan';
import MockTest from './pages/MockTest';
import { authUtils } from './utils/auth';
import './index.css';
import './App.css';

const ProtectedRoute = ({ element }) => {
  return authUtils.isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/diagnostic-test" element={<ProtectedRoute element={<DiagnosticTest />} />} />
        <Route path="/learning-path" element={<ProtectedRoute element={<LearningPath />} />} />
        <Route path="/resources" element={<ProtectedRoute element={<Resources />} />} />
        <Route path="/progress" element={<ProtectedRoute element={<Progress />} />} />
        <Route path="/study-plan" element={<ProtectedRoute element={<StudyPlan />} />} />
        <Route path="/mock-test" element={<ProtectedRoute element={<MockTest />} />} />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
