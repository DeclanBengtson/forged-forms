'use client';

import { useState, useEffect, useCallback } from 'react';
import { Form, Submission } from '@/lib/types/database';
import { listSubmissions, getFormStats, getFormAnalytics } from '@/lib/api/client';
import CodeExample from '@/components/dashboard/CodeExample'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

type TabType = 'setup' | 'submissions' | 'analytics' | 'settings';

// Utility function to format UUID for display
function formatUUID(uuid: string): string {
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 8)}`
}

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
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const endpointUrl = `${window.location.origin}/api/forms/${form.id}`;

  // Load form stats when component mounts
  const loadFormStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const result = await getFormStats(form.id);
      if (result.success && result.data) {
        setStats(result.data.stats);
      }
    } catch (err) {
      console.error('Failed to load form stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [form.id]);

  useEffect(() => {
    loadFormStats();
  }, [loadFormStats]);

  // Load analytics when component mounts or when switching to analytics tab
  const loadAnalytics = useCallback(async () => {
    if (activeTab !== 'analytics') return;
    
    setAnalyticsLoading(true);
    try {
      const result = await getFormAnalytics(form.id);
      if (result.success && result.data) {
        setAnalytics(result.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [form.id, activeTab]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [activeTab, loadAnalytics]);

  // Load submissions when tab changes to submissions or component mounts
  const loadSubmissions = useCallback(async (page = 1) => {
    if (activeTab !== 'submissions') return;
    
    setSubmissionsLoading(true);
    setSubmissionsError(null);
    
    try {
      const result = await listSubmissions(form.id, { 
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
  }, [form.id, submissionsPerPage, activeTab]);

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
      const response = await fetch(`/api/forms/${form.id}/submissions/export`);
      if (!response.ok) {
        throw new Error('Failed to export submissions');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${form.name}-submissions.csv`;
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
    { id: 'analytics' as TabType, label: 'Analytics', icon: '📊' },
    { id: 'settings' as TabType, label: 'Settings', icon: '🔧' }
  ];

  const renderSubmissionsTable = () => {
    if (submissionsLoading) {
      return (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-normal">Loading submissions...</p>
        </div>
      );
    }

    if (submissionsError) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-sm flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading submissions</h3>
          <p className="text-gray-500 font-light mb-4">{submissionsError}</p>
          <button
            onClick={() => loadSubmissions(currentPage)}
            className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (submissions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-500 font-light mb-4">
            When people submit your form, their responses will appear here.
          </p>
          <button
            onClick={() => copyToClipboard(endpointUrl, 'submissions-url')}
            className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
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
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-normal text-gray-400 uppercase tracking-wide">
                  Submitted
                </th>
                {fieldNames.map((field) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-normal text-gray-400 uppercase tracking-wide">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-normal">
                    {formatSubmissionDate(submission.submitted_at)}
                  </td>
                  {fieldNames.map((field) => (
                    <td key={field} className="px-6 py-4 text-sm text-gray-900 font-normal">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-normal">
              Showing {((currentPage - 1) * submissionsPerPage) + 1} to {Math.min(currentPage * submissionsPerPage, totalSubmissions)} of {totalSubmissions} submissions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-normal transition-all duration-300"
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
                    className={`px-3 py-1 text-sm border rounded-sm font-normal transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-normal transition-all duration-300"
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
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Form Endpoint
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    Endpoint URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={endpointUrl}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 font-mono text-sm"
                      />
                    </div>
                    <button
                      onClick={() => copyToClipboard(endpointUrl, 'url')}
                      className="px-4 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
                    >
                      {copied === 'url' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Implementation Examples
              </h3>
              <CodeExample />
            </div>

            {/* Form Configuration */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Form Configuration
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">
                      Redirect URL (optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://yoursite.com/thank-you"
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-white text-gray-900 text-sm font-normal"
                    />
                    <p className="text-xs text-gray-500 font-light mt-1">
                      Where to redirect users after form submission
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={form.notification_email || ''}
                      placeholder="notifications@yoursite.com"
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-white text-gray-900 text-sm font-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'submissions':
        return (
          <div className="space-y-6">
            {/* Stats */}
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-sm p-6">
                    <div className="animate-pulse">
                      <div className="h-3 bg-gray-200 rounded w-16 mb-3"></div>
                      <div className="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Total</div>
                      <div className="text-2xl font-medium text-gray-900">{stats.total}</div>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">This Week</div>
                      <div className="text-2xl font-medium text-gray-900">{stats.thisWeek}</div>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">This Month</div>
                      <div className="text-2xl font-medium text-gray-900">{stats.thisMonth}</div>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Avg/Day</div>
                      <div className="text-2xl font-medium text-gray-900">{stats.avgPerDay.toFixed(1)}</div>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Export */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Submissions</h3>
              <button
                onClick={handleExportCsv}
                className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
              >
                Export CSV
              </button>
            </div>

            {/* Submissions Table */}
            {renderSubmissionsTable()}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {analyticsLoading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 mx-auto mb-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 font-normal">Loading analytics...</p>
              </div>
            ) : analytics ? (
              <>
                {/* Time Series Chart */}
                <div className="bg-white border border-gray-200 rounded-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Submissions Over Time (Last 30 Days)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="displayDate" 
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="submissions" 
                          stroke="#1f2937" 
                          strokeWidth={2}
                          dot={{ fill: '#1f2937', r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-sm p-6">
                    <h4 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-2">Total Submissions</h4>
                    <div className="text-3xl font-medium text-gray-900">{analytics.totalSubmissions}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-sm p-6">
                    <h4 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-2">Unique Fields</h4>
                    <div className="text-3xl font-medium text-gray-900">{Object.keys(analytics.fieldAnalysis).length}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-sm p-6">
                    <h4 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-2">Avg Per Day</h4>
                    <div className="text-3xl font-medium text-gray-900">
                      {(analytics.totalSubmissions / 30).toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Hourly and Daily Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Submissions by Hour</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.hourlyDistribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="hour" 
                            stroke="#6b7280"
                            fontSize={10}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '4px'
                            }}
                          />
                          <Bar dataKey="count" fill="#374151" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Submissions by Day of Week</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.dailyDistribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="shortDay" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '4px'
                            }}
                          />
                          <Bar dataKey="count" fill="#374151" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Field Analysis */}
                {Object.keys(analytics.fieldAnalysis).length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Field Completion Rates</h3>
                    <div className="space-y-4">
                      {Object.entries(analytics.fieldAnalysis).map(([field, stats]: [string, any]) => (
                        <div key={field} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-normal text-gray-900">{field}</span>
                              <span className="text-sm text-gray-500">
                                {stats.filled}/{stats.total} ({stats.completionRate.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${stats.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
                <p className="text-gray-500 font-light">
                  Analytics will appear here once you start receiving form submissions.
                </p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Form Information */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Form Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-1">
                    Form Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-white text-gray-900 text-sm font-normal"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-1">
                    Form ID
                  </label>
                  <input
                    type="text"
                    value={form.id}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 text-sm font-mono"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Unique identifier used in form URLs (cannot be changed)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-1">
                    Created
                  </label>
                  <input
                    type="text"
                    value={formatDate(form.created_at)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 text-sm font-normal"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-sm p-6">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 font-light mb-4">
                Once you delete a form, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => onDeleteForm(form)}
                className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all duration-300 text-sm font-normal"
              >
                Delete Form
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-6 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">{form.name}</h1>
            <p className="text-sm text-gray-500 font-light mt-1">ID: {formatUUID(form.id)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              form.is_active ? 'bg-gray-900' : 'bg-gray-300'
            }`} />
            <span className="text-sm font-normal text-gray-500">
              {form.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-normal text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dot-grid">
        <div className="max-w-6xl mx-auto p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 