// components/skeletons/PostSkeleton.jsx
export function PostSkeleton() {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-32 bg-gray-300 rounded"></div>
      </div>
    )
  }