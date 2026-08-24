import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TrialsPage from './pages/TrialsPage';
import TrialDetailPage from './pages/TrialDetailPage';
import './index.css';

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trials"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TrialsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trials/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TrialDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
