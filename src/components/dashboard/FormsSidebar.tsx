'use client';

import { Form } from '@/lib/types/database';

interface FormsSidebarProps {
  forms: Form[];
  selectedForm: Form | null;
  onSelectForm: (form: Form | null) => void;
  onCreateForm: () => void;
  onDeleteForm: (form: Form) => void;
}

export default function FormsSidebar({ 
  forms, 
  selectedForm, 
  onSelectForm, 
  onCreateForm, 
  onDeleteForm 
}: FormsSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 h-full">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Forms
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {forms.length}
              </span>
            </div>
            <button
              onClick={onCreateForm}
              className="w-6 h-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              title="Create new form"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Dashboard Overview Button */}
          <button
            onClick={() => onSelectForm(null)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !selectedForm 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="ml-3">Overview</span>
          </button>
        </div>

        {/* Forms List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {forms.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">No forms yet</p>
              <p className="text-xs text-gray-500">Create your first form to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {forms.map((form) => (
                <div key={form.id} className="group relative">
                  <button
                    onClick={() => onSelectForm(form)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      selectedForm?.id === form.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        form.is_active 
                          ? 'bg-emerald-500 shadow-sm' 
                          : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0 ml-3 text-left">
                      <div className="font-medium truncate">{form.name}</div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">
                        /{form.slug}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteForm(form);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    title={`Delete ${form.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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