import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
}

export default function SkeletonTable({ rows = 12 }: SkeletonTableProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex h-11 items-center gap-3 px-3">
            <Skeleton className="h-4 w-6 rounded-md" /> {/* id */}
            <Skeleton className="h-4 flex-1 rounded-md" /> {/* title */}
            <Skeleton className="h-4 w-4 rounded-full" /> {/* priority */}
            <Skeleton className="hidden h-4 w-24 rounded-md sm:block" /> {/* status */}
            <Skeleton className="hidden h-4 w-24 rounded-md md:block" /> {/* sprint */}
            <Skeleton className="h-6 w-6 rounded-full" /> {/* assignee */}
          </div>
        ))}
      </div>
      {/* match the list's bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card via-card/70 to-transparent"
      />
    </div>
  );
}
