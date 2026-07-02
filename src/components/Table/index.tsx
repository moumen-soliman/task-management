"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TableBody from "./TableBody";
import { useFilteredTasksStore } from "@/store/useFilteredTasksStore";
import { useDataViewStore } from "@/store/useDataViewStore";

const LOAD_STEP = 20;
const LOAD_THRESHOLD = 240; // px from the bottom that triggers the next batch

export default function Table() {
  const filteredTasks = useFilteredTasksStore((state) => state.filteredTasks);
  const totalFilteredCount = useFilteredTasksStore((state) => state.totalFilteredCount);
  const setVisibleCount = useDataViewStore((state) => state.setVisibleCount);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  const hasMore = filteredTasks.length < totalFilteredCount;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const loadMore = useCallback(() => {
    if (hasMoreRef.current) setVisibleCount((count) => count + LOAD_STEP);
  }, [setVisibleCount]);

  // Make the list fill the window: height = viewport minus the list's top offset.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const top = el.getBoundingClientRect().top;
      // 84px clearance for the floating island; the upper cap guards against a
      // scrolled/negative `top` inflating the height (which fed a page-growth loop)
      const available = window.innerHeight - top - 84;
      setHeight(Math.max(320, Math.min(available, window.innerHeight - 120)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Load more as the user nears the bottom.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - LOAD_THRESHOLD) {
      loadMore();
    }
  }, [loadMore]);

  // Auto-fill: if the loaded rows don't fill the viewport yet, keep revealing more.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasMore) return;
    if (el.scrollHeight <= el.clientHeight + LOAD_THRESHOLD) {
      loadMore();
    }
  }, [filteredTasks.length, hasMore, height, loadMore]);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={height ? { height } : undefined}
        className="overflow-y-auto overscroll-contain [scrollbar-width:thin]"
      >
        <div role="table" aria-label="Tasks" className="w-full">
          <TableBody filteredTasks={filteredTasks} />
        </div>
        {/* clearance so the last row can scroll above the fade */}
        <div aria-hidden className="h-16" />
      </div>

      {/* Fade the end of the list into the surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-xl bg-gradient-to-t from-card via-card/70 to-transparent"
      />
    </div>
  );
}
