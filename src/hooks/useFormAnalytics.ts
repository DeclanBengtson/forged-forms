import { useState, useEffect, useCallback } from 'react';
import { getFormAnalytics } from '@/lib/api/client';

export function useFormAnalytics(formId: string, enabled = false) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFormAnalytics(formId);
      if (result.success && result.data) {
        setAnalytics(result.data.analytics);
      } else {
        setError(result.error || 'Failed to load analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [formId, enabled]);

  useEffect(() => {
    if (enabled) {
      loadAnalytics();
    }
  }, [enabled, loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: loadAnalytics
  };
} 