import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./views/Login/Loginpage";
import RegisterPage from "./views/Register/Registerpage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import DashboardRouter from "./views/components/DashboardRouter";
import './App.css'

function App() {
  return ( 
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Route unique du dashboard qui utilise un routeur basé sur le rôle */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardRouter />
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