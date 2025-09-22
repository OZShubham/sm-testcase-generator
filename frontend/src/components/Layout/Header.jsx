import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { HeartHandshake, LayoutDashboard, Upload, Wand2, FileCheck, Settings, User, Menu, X, Briefcase } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, signout, isAuthenticated } = useAuth();

  const handleSignout = async () => {
    try {
      await signout();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload & Track' },
    { to: '/generate', icon: Wand2, label: 'Generate' },
    { to: '/test-cases', icon: FileCheck, label: 'Test Cases' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <HeartHandshake size={28} />
          <span>HealthTest AI</span>
        </div>

        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `header__nav-item ${isActive ? 'header__nav-item--active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          {isAuthenticated && (
            <div className="header__profile">
              <div className="header__user-info">
                <span className="header__user-name">{userProfile?.name || user?.displayName || user?.email}</span>
                <span className="header__user-role">{userProfile?.role || 'User'}</span>
              </div>
              <div className="header__avatar">
                <User size={20} />
              </div>
              <button onClick={handleSignout} className="signout-button">Sign Out</button>
            </div>
          )}
        </div>

        <button className="header__mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
