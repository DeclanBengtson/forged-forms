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
  activeTab?: 'dashboard' | 'documentation';
}

export default function DashboardNavigation({  
  onSelectForm, 
  onCreateForm, 
  onLogout, 
  user, 
  loading = false,
  activeTab: propActiveTab = 'dashboard'
}: DashboardNavigationProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(propActiveTab);

  // Get initials for profile picture
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 px-8 py-6 z-20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side - Logo and Username */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image src="/ForgedForms.png" alt="ForgedForms Logo" width={28} height={28} className="opacity-90" />
            <span className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
              ForgedForms
            </span>
          </Link>
          
          {user.email && (
            <div className="text-sm text-gray-500 font-light">
              {user.email.split('@')[0]}
            </div>
          )}
        </div>

        {/* Center - Navigation Tabs */}
        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard"
            onClick={() => {
              setActiveTab('dashboard');
              onSelectForm(null);
            }}
            className={`px-6 py-3 text-sm font-normal rounded-none border-b-2 transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/documentation"
            onClick={() => setActiveTab('documentation')}
            className={`px-6 py-3 text-sm font-normal rounded-none border-b-2 transition-all duration-300 ${
              activeTab === 'documentation'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documentation
          </Link>
        </div>

        {/* Right Side - Create Form Button and Profile */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onCreateForm}
            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-normal rounded-sm hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
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
              className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              {user.email ? getInitials(user.email) : 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-sm border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-300 block"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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