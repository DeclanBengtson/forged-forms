import { useFormStats } from '@/hooks/useFormStats';
import { useFormSubmissions } from '@/hooks/useFormSubmissions';
import StatsCards from '@/components/dashboard/StatsCards';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';

interface FormSubmissionsTabProps {
  formId: string;
}

export default function FormSubmissionsTab({ formId }: FormSubmissionsTabProps) {
  const { stats, loading: statsLoading } = useFormStats(formId);
  const submissionsHook = useFormSubmissions(formId, { autoFetch: true });

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    currentPage,
    totalPages,
    totalSubmissions,
    submissionsPerPage,
    handlePageChange,
    handleExportCsv,
    refetch
  } = submissionsHook;

  const handleExport = async () => {
    try {
      await handleExportCsv();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export submissions');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Export */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Submissions</h3>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
        >
          Export CSV
        </button>
      </div>

      {/* Submissions Table */}
      <SubmissionsTable
        submissions={submissions}
        loading={submissionsLoading}
        error={submissionsError}
        currentPage={currentPage}
        totalPages={totalPages}
        totalSubmissions={totalSubmissions}
        submissionsPerPage={submissionsPerPage}
        onPageChange={handlePageChange}
        onRetry={refetch}
        formId={formId}
      />
    </div>
  );
} 