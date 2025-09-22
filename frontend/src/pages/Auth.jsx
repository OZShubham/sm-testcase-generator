import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import './Auth.css';

const Auth = () => {
  const [currentView, setCurrentView] = useState('login');
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    // Redirect handled by useEffect
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-container">
          {currentView === 'login' ? (
            <LoginForm 
              onSwitchToRegister={() => setCurrentView('register')}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <RegisterForm 
              onSwitchToLogin={() => setCurrentView('login')}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;