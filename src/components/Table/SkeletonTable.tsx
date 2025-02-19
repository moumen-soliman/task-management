import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center p-4 space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-6 flex-1 rounded-md" />
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center p-4">
        <Skeleton className="h-8 w-24 rounded-md" /> {/* Previous Button Skeleton */}
        <Skeleton className="h-8 w-16 rounded-md" /> {/* Page Numbers Skeleton */}
        <Skeleton className="h-8 w-24 rounded-md" /> {/* Next Button Skeleton */}
      </div>
    </div>
  );
}
