import { useState, useEffect, useCallback } from 'react';
import { getFormStats } from '@/lib/api/client';

interface FormStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  avgPerDay: number;
}

export function useFormStats(formId: string) {
  const [stats, setStats] = useState<FormStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFormStats(formId);
      if (result.success && result.data) {
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Failed to load stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats
  };
} 