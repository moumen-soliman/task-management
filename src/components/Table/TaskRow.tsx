import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter } from "next/navigation";
import { PencilLineIcon } from "lucide-react";

const TaskRow = ({ task, index }) => {
  const {
    updateTask,
    softDeleteTask,
    undoDeleteTask,
    assignUserToTask,
    removeUserFromTask,
    addTaskToSprint,
    removeTaskFromSprint,
    getAssignedUser,
    getSprintNames,
    moveTask
  } = useTaskStore();

  const { openSheet } = useSheetStore();

    const router = useRouter();
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableTask, setEditableTask] = useState(task);

    const [, drop] = useDrop({
        accept: "TASK",
        hover(item: { index: number }) {
            if (item.index !== index) {
                moveTask(item.index, index);
                item.index = index;
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "TASK",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

  const handleTaskClick = (taskId: string) => {
    if(!isEditing) {
        openSheet("edit", Number(taskId));
        router.replace(`?task=${taskId}`, undefined);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    updateTask(task.id, editableTask);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditableTask({ ...editableTask, [field]: value });
  };

  return (
    <tr ref={ref} className={`border-b ${isDragging ? "opacity-50" : ""}`}>
      <td className="py-2 px-4" onClick={() => handleTaskClick(task.id)}>
        {isEditing ? (
          <input
            type="text"
            value={editableTask.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        ) : (
          task.title
        )}
      </td>
      <td className="py-2 px-2">
        {isEditing ? (
          <Select onValueChange={(value) => handleChange("status", value)} value={editableTask.status}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={editableTask.status} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          task.status
        )}
      </td>
      <td className="py-2 px-2">
        {isEditing ? (
          <Select onValueChange={(value) => handleChange("priority", value)} value={editableTask.priority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={editableTask.priority} />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES_LIST.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          task.priority
        )}
      </td>
      <td className="py-2 px-4">
        <div className="flex -space-x-2 overflow-hidden">
          {task.assign && task.assign.length > 0 ? (
            getAssignedUser(task.assign.map(Number))?.map((user, index) => (
              <TooltipProvider key={`${user.id}-${index}`}>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
                      <AvatarImage src={user?.image?.url ?? ""} alt={user?.name ?? ""} />
                      <AvatarFallback>{user?.name?.charAt(0) || "?"}</AvatarFallback>
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
          {isEditing ? (
            <button onClick={handleSaveClick} className="text-green-500">
              Save
            </button>
          ) : (
            <PencilLineIcon onClick={handleEditClick} className="h-5 w-5 text-gray-500 cursor-pointer" />
          )}
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
                <button onClick={() => assignUserToTask(task.id, 5)} className="text-green-500">
                  Assign User #5
                </button>
              )}
              {addTaskToSprint && (
                <button onClick={() => addTaskToSprint(task.id, 1)} className="text-purple-500">
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
  );
};

export default TaskRow;
