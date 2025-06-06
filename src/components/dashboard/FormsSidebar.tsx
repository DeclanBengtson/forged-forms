'use client';

import { Form } from '@/lib/types/database';

interface FormsSidebarProps {
  forms: Form[];
  selectedForm: Form | null;
  onSelectForm: (form: Form | null) => void;
  onCreateForm: () => void;
  onDeleteForm: (form: Form) => void;
}

// Utility function to format UUID for display
function formatUUID(uuid: string): string {
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 8)}`
}

export default function FormsSidebar({ 
  forms, 
  selectedForm, 
  onSelectForm, 
  onCreateForm, 
  onDeleteForm 
}: FormsSidebarProps) {
  return (
    <div className="w-64 fixed left-0 top-[73px] bg-white border-r border-gray-200 h-[calc(100vh-73px)] z-10 pt-4">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-normal text-gray-400 uppercase tracking-wide">
                Forms
              </span>
              <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-sm">
                {forms.length}
              </span>
            </div>
            <button
              onClick={onCreateForm}
              className="w-7 h-7 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
              title="Create new form"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Dashboard Overview Button */}
          <button
            onClick={() => onSelectForm(null)}
            className={`w-full flex items-center px-4 py-3 rounded-sm text-sm font-normal transition-all duration-300 border ${
              !selectedForm 
                ? 'bg-gray-50 text-gray-900 border-gray-300' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-200'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="ml-3">Overview</span>
          </button>
        </div>

        {/* Forms List */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {forms.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-normal text-gray-700 mb-1">No forms yet</p>
              <p className="text-xs text-gray-500 font-light">Create your first form to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {forms.map((form) => (
                <div key={form.id} className="group relative">
                  <button
                    onClick={() => onSelectForm(form)}
                    className={`w-full flex items-center px-4 py-3.5 rounded-sm text-sm transition-all duration-300 border ${
                      selectedForm?.id === form.id 
                        ? 'bg-gray-50 text-gray-900 border-gray-300' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        form.is_active 
                          ? 'bg-gray-900' 
                          : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0 ml-4 text-left">
                      <div className="font-normal truncate">{form.name}</div>
                      <div className="text-xs text-gray-400 font-light truncate mt-1">
                        ID: {formatUUID(form.id)}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteForm(form);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    title={`Delete ${form.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 