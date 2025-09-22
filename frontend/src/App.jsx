import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth.jsx';
import { AppProvider } from './context/AppContext.jsx';

// --- Page & Component Imports ---
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import DocumentUpload from './pages/DocumentUpload';
import TestGeneration from './pages/TestGeneration';
import TestCaseManager from './pages/TestCaseManager';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import './App.css';

// --- Protected Route Component ---
// This component checks for authentication and shows a loading indicator
// or redirects to the auth page if the user is not logged in.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();

  if (loading || (isAuthenticated && !userProfile)) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// --- Main Application Layout ---
// This component contains the main layout. It will only be rendered for
// authenticated users and is wrapped by the AppProvider to provide state.
const ProtectedAppLayout = () => {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {/* Nested routes for the main application */}
        <Routes>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<DocumentUpload />} />
          <Route path="generate" element={<TestGeneration />} />
          <Route path="generate/:documentId" element={<TestGeneration />} />
          <Route path="test-cases" element={<TestCaseManager />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};


// --- Top-level Routing Component ---
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public auth route: If logged in, redirect to dashboard */}
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} 
      />

      {/* Protected application routes */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <ProtectedAppLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};


// --- Main App Component ---
// This is the root of your application, setting up providers and the router.
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
