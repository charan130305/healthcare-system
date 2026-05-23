import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CitizenDashboard from './pages/Dashboard/CitizenDashboard';
import WorkerDashboard from './pages/Dashboard/WorkerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

// Guard for authenticated access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-health-600 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect if role doesn't match
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'ROLE_HEALTH_WORKER') return <Navigate to="/worker-dashboard" replace />;
    return <Navigate to="/citizen-dashboard" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Protected Routes */}
          <Route
            path="/citizen-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/appointments" element={<Navigate to="/citizen-dashboard" replace />} />
          <Route path="/complaints" element={<Navigate to="/citizen-dashboard" replace />} />
          <Route path="/health-profile" element={<Navigate to="/citizen-dashboard" replace />} />
          <Route path="/chatbot" element={<Navigate to="/citizen-dashboard" replace />} />

          {/* Worker Protected Routes */}
          <Route
            path="/worker-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_HEALTH_WORKER']}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/worker/*" element={<Navigate to="/worker-dashboard" replace />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin-dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
