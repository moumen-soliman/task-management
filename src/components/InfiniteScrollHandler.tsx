import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDataViewStore } from "@/store/useDataViewStore";
import { Task } from "@/types/Tasks";

const InfiniteScrollHandler: React.FC<{ indicator: Task[] }> = ({ indicator, children }) => {
  const { ref, inView } = useInView({ threshold: 1 });
  const { visibleCount, setVisibleCount } = useDataViewStore();

  useEffect(() => {
    if (inView) {
      setVisibleCount((prev: number) => Math.min(prev + 10, indicator.length));
    }
  }, [inView, indicator.length, setVisibleCount]);

  return (
    <div>
      {children}
      <div ref={ref} />
      <div className="h-10 mt-4 text-center text-gray-500">
        {visibleCount < indicator.length ? "Loading more tasks..." : "No more tasks"}
      </div>
    </div>
  );
};

export default InfiniteScrollHandler;
