import { useFormAnalytics } from '@/hooks/useFormAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FormAnalyticsTabProps {
  formId: string;
  isActive: boolean;
}

export default function FormAnalyticsTab({ formId, isActive }: FormAnalyticsTabProps) {
  const { analytics, loading, error } = useFormAnalytics(formId, isActive);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 mx-auto mb-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-normal">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-sm flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading analytics</h3>
        <p className="text-gray-500 font-light">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
} 