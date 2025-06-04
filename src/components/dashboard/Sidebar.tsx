'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Form } from '@/lib/types/database';

interface NavbarProps {
  forms: Form[];
  selectedForm: Form | null;
  onSelectForm: (form: Form | null) => void;
  onCreateForm: () => void;
  onDeleteForm: (form: Form) => void;
  onLogout: () => void;
  user: { email?: string };
  loading?: boolean;
}

export default function Navbar({  
  onSelectForm, 
  onCreateForm, 
  onLogout, 
  user, 
  loading = false 
}: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Get initials for profile picture
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 px-6 py-4 z-20">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Username */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/ForgedForms.png" alt="ForgedForms Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              ForgedForms
            </span>
          </Link>
          
          {user.email && (
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user.email.split('@')[0]}</span>
            </div>
          )}
        </div>

        {/* Center - Navigation Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              onSelectForm(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'documentation'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Documentation
          </button>
        </div>

        {/* Right Side - Create Form Button and Profile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onCreateForm}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Form
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:shadow-md transition-all duration-200"
            >
              {user.email ? getInitials(user.email) : 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler for profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
} 