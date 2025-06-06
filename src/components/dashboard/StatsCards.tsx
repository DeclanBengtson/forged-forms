interface FormStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  avgPerDay: number;
}

interface StatsCardsProps {
  stats: FormStats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
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
    );
  }

  if (!stats) {
    return null;
  }

  return (
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
  );
} 