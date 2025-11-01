export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-4"></div>
        </div>
        
        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}