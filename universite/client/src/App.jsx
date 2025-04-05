import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./views/Login/Loginpage";
import RegisterPage  from "./views/Register/Registerpage";
import { SecretaryDashboard } from "./views/Dashboards/Secretary/SecretaryDashboard";
import { TeacherDashboard } from "./views/Dashboards/Teacher/TeacherDashboard";
import { StudentDashboard } from "./views/Dashboards/Student/StudentDashboard";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import './App.css' // Import du composant PrivateRoute

function App() {
  return ( 
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route
            path="/secretaire/*"
            element={
              <PrivateRoute>
                <SecretaryDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/enseignant/*"
            element={
              <PrivateRoute>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/etudiant/*"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Redirection vers /login par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
