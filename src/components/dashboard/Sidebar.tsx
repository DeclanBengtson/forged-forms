'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Form } from '@/lib/types/database';

interface SidebarProps {
  forms: Form[];
  selectedForm: Form | null;
  onSelectForm: (form: Form | null) => void;
  onCreateForm: () => void;
  onDeleteForm: (form: Form) => void;
  onLogout: () => void;
  user: { email?: string };
  loading?: boolean;
}

export default function Sidebar({ 
  forms, 
  selectedForm, 
  onSelectForm, 
  onCreateForm, 
  onDeleteForm,
  onLogout, 
  user, 
  loading = false 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <img src="/ForgedForms.png" alt="FormFlow Logo" className="w-8 h-8" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  FormFlow
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Dashboard Overview Button */}
            <button
              onClick={() => onSelectForm(null)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                !selectedForm 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="font-medium">Dashboard</span>
              )}
            </button>

            {/* Forms Section */}
            <div className="mt-6">
              <div className={`flex items-center justify-between ${isCollapsed ? 'justify-center' : ''} mb-3`}>
                {!isCollapsed && (
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Forms ({forms.length})
                  </span>
                )}
                <button
                  onClick={onCreateForm}
                  className={`${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center`}
                  title="Create new form"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Forms List */}
              <div className="space-y-1">
                {forms.length === 0 ? (
                  !isCollapsed && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="font-medium mb-1">No forms yet</p>
                      <p className="text-xs">Create your first form to get started</p>
                    </div>
                  )
                ) : (
                  forms.map((form) => (
                    <div key={form.id} className="group relative">
                      <button
                        onClick={() => onSelectForm(form)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                          selectedForm?.id === form.id 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full ${
                            form.is_active 
                              ? 'bg-green-500' 
                              : 'bg-gray-400'
                          }`} />
                        </div>
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{form.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              /{form.slug}
                            </div>
                          </div>
                        )}
                      </button>
                      {!isCollapsed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteForm(form);
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          title={`Delete ${form.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {user.email}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Signed in
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            disabled={loading}
            className={`${isCollapsed ? 'w-8 h-8' : 'w-full'} flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && (
              <span>{loading ? 'Signing out...' : 'Sign out'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 