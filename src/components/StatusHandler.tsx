import React from "react";
import { Status } from "@/types/Tasks";

interface StatusHandlerProps {
  status?: Status;
  /** Hide the text label to show the icon only (very dense rows). */
  showLabel?: boolean;
}

const statusMeta: Record<Status, { label: string; color: string }> = {
  not_started: { label: "Not started", color: "text-gray-400 dark:text-gray-500" },
  in_progress: { label: "In progress", color: "text-amber-500" },
  completed: { label: "Completed", color: "text-emerald-500" },
};

/** Linear-style status glyph: dashed ring (todo) → half-filled ring (in progress) → checked disc (done). */
function StatusIcon({ status }: { status: Status }) {
  const { color } = statusMeta[status] ?? statusMeta.not_started;

  if (status === "completed") {
    return (
      <svg viewBox="0 0 14 14" className={`h-3.5 w-3.5 ${color}`} aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="currentColor" />
        <path
          d="M4.4 7.1l1.7 1.7 3.4-3.6"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === "in_progress") {
    return (
      <svg viewBox="0 0 14 14" className={`h-3.5 w-3.5 ${color}`} aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7 L7 2 A5 5 0 0 1 7 12 Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 14 14" className={`h-3.5 w-3.5 ${color}`} aria-hidden="true">
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.2 2.2"
      />
    </svg>
  );
}

export default function StatusHandler({ status = "not_started", showLabel = true }: StatusHandlerProps) {
  const { label } = statusMeta[status] ?? statusMeta.not_started;

  return (
    <span
      title={`Status: ${label}`}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <StatusIcon status={status} />
      {showLabel && <span className="whitespace-nowrap">{label}</span>}
    </span>
  );
}
