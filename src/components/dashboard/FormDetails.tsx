'use client';

import { useState, useEffect, useCallback } from 'react';
import { Form, Submission } from '@/lib/types/database';
import { listSubmissions, getFormStats } from '@/lib/api/client';
import CodeExample from '@/components/dashboard/CodeExample'

interface FormDetailsProps {
  form: Form;
  onFormUpdated: () => void;
  onDeleteForm: (form: Form) => void;
}

interface FormStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  avgPerDay: number;
}

type TabType = 'setup' | 'submissions' | 'settings';

export default function FormDetails({ form, onFormUpdated: _onFormUpdated, onDeleteForm }: FormDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [_isEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('setup');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [submissionsPerPage] = useState(10);
  const [stats, setStats] = useState<FormStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const endpointUrl = `${window.location.origin}/api/forms/${form.slug}`;

  // Load form stats when component mounts
  const loadFormStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const result = await getFormStats(form.slug);
      if (result.success && result.data) {
        setStats(result.data.stats);
      }
    } catch (err) {
      console.error('Failed to load form stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [form.slug]);

  useEffect(() => {
    loadFormStats();
  }, [loadFormStats]);

  // Load submissions when tab changes to submissions or component mounts
  const loadSubmissions = useCallback(async (page = 1) => {
    if (activeTab !== 'submissions') return;
    
    setSubmissionsLoading(true);
    setSubmissionsError(null);
    
    try {
      const result = await listSubmissions(form.slug, { 
        page, 
        limit: submissionsPerPage, 
        sortOrder: 'desc' 
      });
      
      if (result.success && result.data) {
        setSubmissions(result.data);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalSubmissions(result.pagination.total);
          setCurrentPage(result.pagination.page);
        }
      } else {
        setSubmissionsError(result.error || 'Failed to load submissions');
      }
    } catch (err) {
      setSubmissionsError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  }, [form.slug, submissionsPerPage, activeTab]);

  // Load submissions when switching to submissions tab
  useEffect(() => {
    if (activeTab === 'submissions') {
      loadSubmissions(currentPage);
    }
  }, [activeTab, loadSubmissions, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadSubmissions(page);
  };

  const handleExportCsv = async () => {
    try {
      const response = await fetch(`/api/forms/${form.slug}/submissions/export`);
      if (!response.ok) {
        throw new Error('Failed to export submissions');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${form.slug}-submissions.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export submissions');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSubmissionDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const tabs = [
    { id: 'setup' as TabType, label: 'Setup', icon: '⚙️' },
    { id: 'submissions' as TabType, label: 'Submissions', icon: '📋' },
    { id: 'settings' as TabType, label: 'Settings', icon: '🔧' }
  ];

  const renderSubmissionsTable = () => {
    if (submissionsLoading) {
      return (
        <div className="text-center py-12">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4 animate-spin">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading submissions...</p>
        </div>
      );
    }

    if (submissionsError) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error loading submissions</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{submissionsError}</p>
          <button
            onClick={() => loadSubmissions(currentPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (submissions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            When people submit your form, their responses will appear here.
          </p>
          <button
            onClick={() => copyToClipboard(endpointUrl, 'submissions-url')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {copied === 'submissions-url' ? 'Copied!' : 'Copy Form URL'}
          </button>
        </div>
      );
    }

    // Get all unique field names from submissions for table headers
    const allFields = new Set<string>();
    submissions.forEach(submission => {
      Object.keys(submission.data).forEach(field => allFields.add(field));
    });
    const fieldNames = Array.from(allFields).sort();

    return (
      <div className="space-y-4">
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
                {fieldNames.map((field) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {field}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatSubmissionDate(submission.submitted_at)}
                  </td>
                  {fieldNames.map((field) => (
                    <td key={field} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-xs truncate" title={String(submission.data[field] || '')}>
                        {submission.data[field] 
                          ? Array.isArray(submission.data[field]) 
                            ? (submission.data[field] as string[]).join(', ')
                            : String(submission.data[field])
                          : '-'
                        }
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {submission.ip_address || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * submissionsPerPage) + 1} to {Math.min(currentPage * submissionsPerPage, totalSubmissions)} of {totalSubmissions} submissions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div className="space-y-6">
            {/* Form Endpoint */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Form Endpoint
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Endpoint URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={endpointUrl}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                      />
                    </div>
                    <button
                      onClick={() => copyToClipboard(endpointUrl, 'url')}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {copied === 'url' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Implementation Examples
              </h3>
              <CodeExample />
            </div>

            {/* Form Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Form Configuration
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Redirect URL (optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://yoursite.com/thank-you"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Where to redirect users after form submission
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={form.notification_email || ''}
                      placeholder="notifications@yoursite.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email to receive form submissions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="spam-protection"
                    checked={true}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="spam-protection" className="text-sm text-gray-700 dark:text-gray-300">
                    Enable spam protection
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="store-submissions"
                    checked={true}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="store-submissions" className="text-sm text-gray-700 dark:text-gray-300">
                    Store submissions in dashboard
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'submissions':
        return (
          <div className="space-y-6">
            {/* Submissions Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Form Submissions
                  </h2>
                  {totalSubmissions > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {totalSubmissions} total submission{totalSubmissions !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {submissions.length > 0 && (
                    <button 
                      onClick={handleExportCsv}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Export CSV
                    </button>
                  )}
                  <button 
                    onClick={() => loadSubmissions(currentPage)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              
              {/* Render submissions table or empty state */}
              {renderSubmissionsTable()}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Form Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Form Settings
              </h2>
              
              <div className="space-y-6">
                {/* Basic Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Form Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        value={form.description || ''}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Describe what this form is for..."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="form-active"
                        checked={form.is_active}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="form-active" className="text-sm text-gray-700 dark:text-gray-300">
                        Form is active and accepting submissions
                      </label>
                    </div>
                  </div>
                </div>

                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={form.email_notifications}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="email-notifications" className="text-sm text-gray-700 dark:text-gray-300">
                        Send email notifications for new submissions
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notification Email
                      </label>
                      <input
                        type="email"
                        value={form.notification_email || ''}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="captcha-enabled"
                        checked={true}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="captcha-enabled" className="text-sm text-gray-700 dark:text-gray-300">
                        Enable CAPTCHA protection
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ip-logging"
                        checked={false}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="ip-logging" className="text-sm text-gray-700 dark:text-gray-300">
                        Log IP addresses with submissions
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-700">
              <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Delete this form</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Once you delete a form, there is no going back. All submissions will be permanently deleted.
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteForm(form)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {form.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  form.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1.5 ${
                    form.is_active ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {form.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {formatDate(form.created_at)}
                </span>
              </div>
            </div>
          </div>
          {form.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {form.description}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Submissions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsLoading ? '...' : (stats?.total ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsLoading ? '...' : (stats?.thisWeek ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsLoading ? '...' : (stats?.thisMonth ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 