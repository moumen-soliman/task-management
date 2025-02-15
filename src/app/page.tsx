"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { useInView } from "react-intersection-observer";

import SheetPanel from "@/components/SheetPanel";
import { useSheetStore } from "@/store/useSheetStore";
import { Toaster } from "@/components/ui/toaster"
import TableHeader from "@/components/Table/TableHeader";
import { CheckCircle, Circle, Timer } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { subscribeToTaskUpdates } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    getAssignedUser,
  } = useTaskStore();

  const [visibleCount, setVisibleCount] = useState(10);
  const { ref, inView } = useInView({ threshold: 1 });
  const { openSheet, resetSheet } = useSheetStore();
  const {updateTask} = useTaskStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchAllData();
    const unsubscribe = subscribeToTaskUpdates(fetchAllData);
    return () => unsubscribe();
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

  const taskColumns = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'assign', label: 'Assign' },
    { key: 'sprint', label: 'Sprint' }
  ];
  
  return (
    <div className="p-4">
      <button onClick={handleAddTaskClick} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        ➕ Add Task
      </button>
      <h2 className="text-2xl font-bold">Task Management v1</h2>

      <table className="min-w-full">
        <thead className="">
          <tr>
            {taskColumns.map((column) => (
              <th key={column.key} className="py-2 px-4 border-b-2 border-gray-300 text-left">
                {column.label}
              </th>
            ))}
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.slice(0, visibleCount).map((task, index) => (
            <tr key={`${task.id}-${index}`} className="border-b">
              <td className="py-2 px-4" onClick={() => handleTaskClick(task.id)}>{task.title}</td>
              <td className="py-2 px-2">
                <Select onValueChange={(value) => updateTask(task.id, { status: value })}>
                  <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={task.status} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_LIST.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="py-2 px-2">
                <Select onValueChange={(value) => updateTask(task.id, { priority: value })}>
                  <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={task.priority} />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES_LIST.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </td>
  
                <td className="py-2 px-4">
          <div className="flex -space-x-2 overflow-hidden">
            {task.assign && task.assign.length > 0 ? (
            getAssignedUser(task.assign.map(Number))?.map((user, index) => (

              
                            <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                              <Avatar key={`${user.id}-${index}`} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
              <AvatarImage src={user?.image?.url ?? ''} alt={user?.name ?? ''} />
              <AvatarFallback>{user?.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user?.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
            ))
            ) : (
            <span className="text-gray-500">None</span>
            )}
          </div>
        </td>

              <td className="py-2 px-4">{getSprintNames(task.sprints).join(", ") || "None"}</td>
              <td className="py-2 px-4">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loader Trigger for Infinite Scrolling */}
      <div ref={ref} className="h-10 mt-4 text-center text-gray-500">
        {visibleCount < tasks.length ? "Loading more tasks..." : "No more tasks"}
      </div>

      <SheetPanel />
      <Toaster />
    </div>
  );
}
