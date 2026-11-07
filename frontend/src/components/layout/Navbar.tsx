import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Code2,
  Terminal,
  BarChart3,
  History,
  FileText,
  PlusCircle,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // In workspace mode, we render a specialized streamlined workspace navbar
  const isWorkspace = location.pathname.startsWith('/interview/') && !location.pathname.endsWith('/result') && !location.pathname.endsWith('/setup');

  if (isWorkspace) {
    return null; // The workspace has its own dedicated top toolbar
  }

  const navLinks = [
    { label: 'Problems', path: '/problems', icon: Terminal },
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'History', path: '/history', icon: History },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Resume Prep', path: '/resume-prep', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-purple-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                CodeArena<span className="text-purple-400 text-sm ml-1 font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">AI</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {user ? (
            <>
              {/* Start Interview CTA */}
              <Link
                to="/interview/setup"
                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium shadow-glow-purple transition-all duration-200 hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Start New Interview</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60"
                >
                  <img
                    src={user.profile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg bg-slate-800 object-cover ring-1 ring-purple-500/40"
                  />
                  <span className="hidden lg:block text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl glass-panel-elevated py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-purple-600/15 hover:text-purple-300 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Candidate Profile</span>
                    </Link>

                    <Link
                      to="/problems/create"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-purple-600/15 hover:text-purple-300 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Custom Problem</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-purple-600/15 hover:text-purple-300 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings & API Keys</span>
                    </Link>

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-glow-purple transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

