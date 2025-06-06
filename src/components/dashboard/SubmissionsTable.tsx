import { useState } from 'react';
import { Submission } from '@/lib/types/database';
import { formatSubmissionDate, copyToClipboard as copyText } from '@/utils/formatting';

interface SubmissionsTableProps {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalSubmissions: number;
  submissionsPerPage: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  formId: string;
}

export default function SubmissionsTable({
  submissions,
  loading,
  error,
  currentPage,
  totalPages,
  totalSubmissions,
  submissionsPerPage,
  onPageChange,
  onRetry,
  formId
}: SubmissionsTableProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    const success = await copyText(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-normal">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-sm flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading submissions</h3>
        <p className="text-gray-500 font-light mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (submissions.length === 0) {
    const endpointUrl = `${window.location.origin}/api/forms/${formId}`;
    
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
              onClick={() => onPageChange(currentPage - 1)}
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
                  onClick={() => onPageChange(pageNum)}
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
              onClick={() => onPageChange(currentPage + 1)}
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
} 