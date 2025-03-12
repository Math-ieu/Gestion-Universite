import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './views/Login/Loginpage';
import { RegisterPage } from './views/Register/Registerpage';
import { SecretaryDashboard } from './views/Dashboards/Secretary/SecretaryDashboard';
import { TeacherDashboard } from './views/Dashboards/Teacher/TeacherDashboard';
import { StudentDashboard } from './views/Dashboards/Student/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/secretary/*" element={<SecretaryDashboard />} />
        <Route path="/teacher/*" element={<TeacherDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;