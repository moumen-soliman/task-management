"use client";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useInView } from "react-intersection-observer";

export default function Dashboard() {
  const {
    tasks,
    loading,
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

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (inView && visibleCount < tasks.length) {
      setVisibleCount((prev) => prev + 10);
    }
  }, [inView, tasks.length]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Task Management v1</h2>

      <ul>
        {tasks.slice(0, visibleCount).map((task) => (
          <li key={task.id} className="flex justify-between border-b p-2">
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
    </div>
  );
}
