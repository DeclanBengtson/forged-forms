import { useState, useEffect, useCallback } from 'react';
import { listSubmissions } from '@/lib/api/client';
import { Submission } from '@/lib/types/database';

interface UseFormSubmissionsOptions {
  submissionsPerPage?: number;
  autoFetch?: boolean;
}

export function useFormSubmissions(
  formId: string, 
  options: UseFormSubmissionsOptions = {}
) {
  const { submissionsPerPage = 10, autoFetch = false } = options;
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  const loadSubmissions = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await listSubmissions(formId, { 
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
        setError(result.error || 'Failed to load submissions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [formId, submissionsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadSubmissions(page);
  }, [loadSubmissions]);

  const handleExportCsv = useCallback(async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/submissions/export`);
      if (!response.ok) {
        throw new Error('Failed to export submissions');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `form-${formId}-submissions.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to export submissions');
    }
  }, [formId]);

  useEffect(() => {
    if (autoFetch) {
      loadSubmissions(currentPage);
    }
  }, [autoFetch, loadSubmissions, currentPage]);

  return {
    submissions,
    loading,
    error,
    currentPage,
    totalPages,
    totalSubmissions,
    submissionsPerPage,
    loadSubmissions,
    handlePageChange,
    handleExportCsv,
    refetch: () => loadSubmissions(currentPage)
  };
} 