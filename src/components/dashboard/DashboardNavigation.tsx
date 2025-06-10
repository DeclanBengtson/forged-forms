'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Form } from '@/lib/types/database';

interface DashboardNavigationProps {
  forms: Form[];
  selectedForm: Form | null;
  onSelectForm: (form: Form | null) => void;
  onCreateForm: () => void;
  onDeleteForm: (form: Form) => void;
  onLogout: () => void;
  user: { email?: string };
  loading?: boolean;
  activeTab?: 'dashboard' | 'documentation' | 'templates';
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function DashboardNavigation({  
  onSelectForm, 
  onCreateForm, 
  onLogout, 
  user, 
  loading = false,
  activeTab: propActiveTab = 'dashboard',
  isSidebarOpen: _isSidebarOpen,
  onToggleSidebar
}: DashboardNavigationProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(propActiveTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get initials for profile picture
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-6 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side - Logo and Username */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          {/* Mobile Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              title="Toggle sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          )}
          
          <Link href="/" className="flex items-center space-x-3 group">
            <Image src="/ForgedForms.png" alt="ForgedForms Logo" width={28} height={28} className="opacity-90" />
            <span className="text-xl font-bold text-gray-900">
              ForgedForms
            </span>
          </Link>
          
          {user.email && (
            <div className="hidden sm:block text-sm text-gray-500 font-light">
              {user.email.split('@')[0]}
            </div>
          )}
        </div>

        {/* Center - Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/dashboard"
            onClick={() => {
              setActiveTab('dashboard');
              onSelectForm(null);
            }}
            className={`px-6 py-3 text-sm font-normal rounded-none border-b-2 transition-colors duration-200 ${
              activeTab === 'dashboard'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/templates"
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 text-sm font-normal rounded-none border-b-2 transition-colors duration-200 ${
              activeTab === 'templates'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </Link>
          <Link
            href="/documentation"
            onClick={() => setActiveTab('documentation')}
            className={`px-6 py-3 text-sm font-normal rounded-none border-b-2 transition-colors duration-200 ${
              activeTab === 'documentation'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documentation
          </Link>
        </div>

        {/* Right Side - Create Form Button and Profile (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={onCreateForm}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-3.5 h-3.5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Form
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            >
              {user.email ? getInitials(user.email) : 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg border border-gray-200 py-2 z-[60] shadow-lg">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 block"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile - Hamburger Menu Button and Profile */}
        <div className="flex md:hidden items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            >
              {user.email ? getInitials(user.email) : 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg border border-gray-200 py-2 z-[60] shadow-lg">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 block"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 px-4">
            <Link
              href="/dashboard"
              onClick={() => {
                setActiveTab('dashboard');
                onSelectForm(null);
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'dashboard'
                  ? 'text-gray-900 bg-gray-50 rounded-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/templates"
              onClick={() => {
                setActiveTab('templates');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'templates'
                  ? 'text-gray-900 bg-gray-50 rounded-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg'
              }`}
            >
              Templates
            </Link>
            <Link
              href="/documentation"
              onClick={() => {
                setActiveTab('documentation');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'documentation'
                  ? 'text-gray-900 bg-gray-50 rounded-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg'
              }`}
            >
              Documentation
            </Link>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onCreateForm();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-3.5 h-3.5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
} 