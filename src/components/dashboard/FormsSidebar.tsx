'use client';

import { Form, Project } from '@/lib/types/database';

interface FormsSidebarProps {
  forms: Form[];
  projects: Project[];
  selectedForm: Form | null;
  selectedProject: Project | null;
  expandedProjects: Set<string>;
  onSelectForm: (form: Form | null) => void;
  _onSelectProject: (project: Project | null) => void;
  onToggleProject: (projectId: string) => void;
  onCreateForm: () => void;
  onCreateProject: () => void;
  onDeleteForm: (form: Form) => void;
}

// Utility function to format UUID for display
function formatUUID(uuid: string): string {
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 8)}`
}

export default function FormsSidebar({ 
  forms, 
  projects,
  selectedForm, 
  selectedProject,
  expandedProjects,
  onSelectForm, 
  _onSelectProject,
  onToggleProject,
  onCreateForm, 
  onCreateProject,
  onDeleteForm 
}: FormsSidebarProps) {

  // Group forms by project and create default project for unassigned forms
  const unassignedForms = forms.filter(form => !form.project_id);
  
  const projectsWithForms = projects.map(project => ({
    ...project,
    forms: forms.filter(form => form.project_id === project.id)
  }));

  // Add default project for unassigned forms if there are any
  const allProjectsWithForms = unassignedForms.length > 0 
    ? [
        {
          id: 'default',
          name: 'Unassigned Forms',
          description: 'Forms not assigned to any project',
          created_at: '',
          updated_at: '',
          forms: unassignedForms
        },
        ...projectsWithForms
      ]
    : projectsWithForms;
  return (
    <div className="w-64 fixed left-0 top-[73px] bg-white border-r border-gray-200 h-[calc(100vh-73px)] z-10 pt-4">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-normal text-gray-400 uppercase tracking-wide">
                Workspace
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onCreateProject}
                className="w-7 h-7 bg-gray-100/70 backdrop-blur-sm text-gray-600 rounded-sm hover:bg-gray-200/70 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all duration-200 flex items-center justify-center"
                title="Create new project"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </button>
              <button
                onClick={onCreateForm}
                className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                title="Create new form"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
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

        {/* Projects and Forms List */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-normal text-gray-700 mb-1">No projects yet</p>
              <p className="text-xs text-gray-500 font-light">Create your first project to organize your forms</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Projects */}
              {allProjectsWithForms.map((project) => (
                <div key={project.id} className="space-y-0">
                  <button
                    onClick={() => onToggleProject(project.id)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-sm text-sm transition-all duration-200 ${
                      selectedProject?.id === project.id 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center mr-3">
                      <svg 
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform mr-2 ${
                          expandedProjects.has(project.id) ? 'rotate-90' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {project.id === 'default' ? (
                        <svg className="w-3.5 h-3.5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 text-left truncate font-medium ${
                      project.id === 'default' ? 'text-gray-600 italic' : ''
                    }`}>{project.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm font-mono">
                      {project.forms.length}
                    </span>
                  </button>
                  
                  {expandedProjects.has(project.id) && (
                    <div className="ml-7 border-l-2 border-gray-100 space-y-0">
                      {project.forms.map((form) => (
                        <div key={form.id} className="group relative">
                          <button
                            onClick={() => onSelectForm(form)}
                            className={`w-full flex items-center pl-4 pr-3 py-2 text-sm transition-all duration-200 ${
                              selectedForm?.id === form.id 
                                ? 'bg-blue-50 text-blue-900 border-r-2 border-blue-500' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center w-2 h-2 flex-shrink-0 mr-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                form.is_active ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="font-medium truncate text-sm">{form.name}</div>
                              <div className="text-xs text-gray-400 font-mono truncate mt-0.5">
                                {formatUUID(form.id)}
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteForm(form);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                            title={`Delete ${form.name}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}


            </div>
          )}
        </div>
      </div>
    </div>
  );
} 