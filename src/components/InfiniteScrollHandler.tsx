import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDataViewStore } from "@/store/useDataViewStore";
import { Task } from "@/types/Tasks";

interface InfiniteScrollHandlerProps {
  indicator: Task[];
  children: React.ReactNode;
}

export default function InfiniteScrollHandler({ indicator, children }: InfiniteScrollHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    rootMargin: '200px'
  });
  const { setVisibleCount } = useDataViewStore();

  useEffect(() => {
    const loadMore = async () => {
      if (inView && !isLoading && indicator.length > 0) {
        setIsLoading(true);
        setVisibleCount((prev: number) => Math.min(prev + 10, indicator.length));
        setIsLoading(false);
      }
    };

    loadMore();
  }, [inView, indicator.length, setVisibleCount, isLoading]);

  return (
    <div>
      {children}
      <div ref={ref} className="h-24" />
      {isLoading ? (
        <div className="h-10 mt-4 text-center text-gray-500 animate-pulse">
          Loading more tasks...
        </div>
      ) : indicator.length === 0 ? (
        <div className="h-10 mt-4 text-center text-gray-500">
          No more tasks
        </div>
      ) : null}
    </div>
  );
}