"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { useInView } from "react-intersection-observer";

import SheetPanel from "@/components/SheetPanel";
import { useSheetStore } from "@/store/useSheetStore";

export default function Dashboard() {
  const {
    tasks,
    fetchAllData,
    softDeleteTask,
    undoDeleteTask,
    assignUserToTask,
    removeUserFromTask,
    addTaskToSprint,
    removeTaskFromSprint,
    getSprintNames,
    getAssignedUserNames,
  } = useTaskStore();

  const [visibleCount, setVisibleCount] = useState(10);
  const { ref, inView } = useInView({ threshold: 1 });
  const { openSheet, resetSheet } = useSheetStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const taskId = searchParams.get("task");
    if (taskId && openSheet) {
      openSheet("edit", Number(taskId));
    }
  }, [searchParams]);

  useEffect(() => {
    if (inView && visibleCount < tasks.length) {
      setVisibleCount((prev) => prev + 10);
    }
  }, [inView, tasks.length]);

  const handleTaskClick = (taskId: string) => {
    openSheet("edit", Number(taskId));
    router.replace(`?task=${taskId}`, undefined);
  };

  const handleAddTaskClick = () => {
    resetSheet();
    openSheet("create");
    router.replace(window.location.pathname, { scroll: false });
  }

  return (
    <div className="p-4">
      <button onClick={handleAddTaskClick} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        ➕ Add Task
      </button>
      <h2 className="text-2xl font-bold">Task Management v1</h2>

      <ul>
        {tasks.slice(0, visibleCount).map((task) => (
          <li key={task.id} className="flex justify-between border-b p-2" onClick={() => handleTaskClick(task.id)}>
            <div>
              <strong>{task.title}</strong> ({task.status}) - {task.priority}
              <br />
              <span className="text-gray-500">
                Sprints: {getSprintNames(task.sprints).join(", ") || "None"}
              </span>
              <br />
              <span className="text-gray-500">
                Assigned: {getAssignedUserNames(task.assign).join(", ") || "None"}
              </span>
            </div>

            <div className="flex gap-2">
              {task.deleted ? (
                <button onClick={() => undoDeleteTask(task.id)} className="text-blue-500">
                  Undo
                </button>
              ) : (
                <>
                  <button onClick={() => softDeleteTask(task.id)} className="text-red-500">
                   Delete
                  </button>

                  {assignUserToTask && (
                    <button
                      onClick={() => assignUserToTask(task.id, 5)}
                      className="text-green-500"
                    >
                      Assign User #5
                    </button>
                  )}

                  {removeUserFromTask && task.assign?.length > 0 && (
                    <button
                      onClick={() => removeUserFromTask(task.id, task.assign[0])}
                      className="text-yellow-500"
                    >
                      Unassign {getAssignedUserNames([task.assign[0]])}
                    </button>
                  )}

                  {addTaskToSprint && (
                    <button
                      onClick={() => addTaskToSprint(task.id, 1)}
                      className="text-purple-500"
                    >
                     Add to Sprint #1
                    </button>
                  )}

                  {removeTaskFromSprint && task.sprints?.length > 0 && (
                    <button
                      onClick={() => removeTaskFromSprint(task.id, task.sprints[0])}
                      className="text-orange-500"
                    >
                      Remove from {getSprintNames([task.sprints[0]])}
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Loader Trigger for Infinite Scrolling */}
      <div ref={ref} className="h-10 mt-4 text-center text-gray-500">
        {visibleCount < tasks.length ? "Loading more tasks..." : "No more tasks"}
      </div>

      <SheetPanel />
    </div>
  );
}
