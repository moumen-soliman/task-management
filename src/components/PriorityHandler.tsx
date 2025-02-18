import React from "react";
import { CheckCircle, AlertTriangle, Flame, Circle, Zap } from "lucide-react";
import { PRIORITIES_LIST } from "@/constants/tasks";

type Priority = (typeof PRIORITIES_LIST)[number];

interface PriorityHandlerProps {
  priority?: Priority;
}

const priorityStyles: Record<Priority, { bg: string; text: string; icon: JSX.Element }> = {
  none: {
    bg: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    text: "None",
    icon: <Circle className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
  },
  low: {
    bg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    text: "Low",
    icon: <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />,
  },
  medium: {
    bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    text: "Medium",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
  },
  high: {
    bg: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    text: "High",
    icon: <Flame className="w-4 h-4 text-red-600 dark:text-red-400" />,
  },
  urgent: {
    bg: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    text: "Urgent",
    icon: <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  },
};

export default function PriorityHandler({ priority = "none" }: PriorityHandlerProps) {
  const { bg, text, icon } = priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles.none;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg}`}
    >
      {icon}
      {text}
    </span>
  );
};