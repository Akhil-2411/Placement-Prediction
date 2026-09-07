import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Building2, 
  History, 
  BarChart3, 
  GraduationCap, 
  ChevronDown 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, signOut, loginAsDemo, isOfficer, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  PlaceIQ
                </span>
                <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  ML Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </Link>

            {isStudent && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/assessment"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    isActive('/assessment') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Assessment</span>
                </Link>
                <Link
                  to="/history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    isActive('/history') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </Link>
                <Link
                  to="/companies"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    isActive('/companies') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Drives</span>
                </Link>
              </>
            )}

            {isOfficer && (
              <>
                <Link
                  to="/officer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    isActive('/officer/dashboard') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Cohort Analytics</span>
                </Link>
                <Link
                  to="/companies"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    isActive('/companies') ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Manage Drives</span>
                </Link>
              </>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Instant Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
                title="Switch active role for instant testing"
              >
                <span>Role: <strong className="capitalize text-blue-700">{user?.role || 'Guest'}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Switch Perspective
                  </div>
                  <button
                    onClick={() => {
                      loginAsDemo('student');
                      setRoleDropdownOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>🎓 Student Mode</span>
                    {user?.role === 'student' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('officer');
                      setRoleDropdownOpen(false);
                      navigate('/officer/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>👔 Placement Officer</span>
                    {user?.role === 'officer' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('admin');
                      setRoleDropdownOpen(false);
                      navigate('/officer/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>🛡️ College Admin</span>
                    {user?.role === 'admin' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {user.full_name?.[0] || 'U'}
                  </div>
                  <span className="hidden lg:inline max-w-[120px] truncate">{user.full_name}</span>
                </Link>
                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          {isStudent && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                to="/assessment"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Placement Assessment
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Prediction History
              </Link>
              <Link
                to="/companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Company Drives
              </Link>
            </>
          )}
          {isOfficer && (
            <>
              <Link
                to="/officer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cohort Analytics
              </Link>
              <Link
                to="/companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Manage Drives
              </Link>
            </>
          )}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Current Role: <strong>{user?.role}</strong></span>
            <button
              onClick={() => {
                loginAsDemo(user?.role === 'student' ? 'officer' : 'student');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-blue-600 font-semibold"
            >
              Toggle Student / Officer
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
