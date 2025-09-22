import { useState } from 'react';
import { useAuth } from '../../utils/auth';
import './LoginForm.css';

const LoginForm = ({ onSwitchToRegister, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { signin, error: authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      await signin(email, password);
      onSuccess?.();
    } catch (error) {
      // The error is already handled and translated in auth.jsx,
      // so we don't need to set a local error here.
      // The authError from useAuth will be displayed.
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="login-form">
      <div className="auth-header">
        <img src="/public/images/logo.svg" alt="Healthcare TestGen" className="auth-logo" />
        <h2>Welcome Back</h2>
        <p>Sign in to your Healthcare TestGen account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {displayError && <div className="error-message">{displayError}</div>}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
