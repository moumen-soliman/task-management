import React, { use, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter } from "next/navigation";
import { Delete, DeleteIcon, PencilLineIcon } from "lucide-react";
import AssignedUsers from "./AssignedUsers";
import { Button } from "@/components/ui/button";
import { useDataViewStore } from "@/store/useDataViewStore";
import PriorityHandler from "./PriorityHandler";
import InfoLabel from "./InfoLabel";

const TaskCard = ({ task, index }) => {
  const {
    updateTask,
    softDeleteTask,
    undoDeleteTask,
    assignUserToTask,
    addTaskToSprint,
    removeTaskFromSprint,
    getAssignedUser,
    getSprintNames,
    moveTask,
  } = useTaskStore();

  const { openSheet } = useSheetStore();
  const router = useRouter();
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(task);
  const dataView = useDataViewStore((state) => state.dataView);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, status: task.status, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover(item: { index: number }) {
      if (dataView === "table" && item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
    drop: (item: { id: number; status: string }) => {
      if (dataView === "kanban") {
        moveTask(item.id, task.status);
      }
    },
  });

  drag(drop(ref));

  const handleTaskClick = (taskId: string) => {
    if (!isEditing) {
      openSheet("edit", Number(taskId));
      router.replace(`?task=${taskId}`, undefined);
    }
  };

  const handleSaveClick = () => {
    updateTask(task.id, editableTask);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditableTask({ ...editableTask, [field]: value });
  };

  if (dataView === "kanban") {
    return (
      <div ref={drag} key={task.id} className={`p-1 rounded-lg  ${isDragging ? "opacity-50" : ""}`}>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold m-w-[50%]">{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">{task.description}</CardDescription>
            <CardDescription className="text-sm text-gray-600">
              <AssignedUsers getAssignedUser={getAssignedUser(task.assign?.map(Number))} />
            </CardDescription>
            <div className="flex items-center justify-between pt-5">
              <div className="flex gap-2 items-center">
                <InfoLabel name={`#${task.id}`} />
                {getSprintNames(task.sprints).map((sprint, index) => (
                  <InfoLabel name={sprint} key={`${sprint}-${index}`} />
                ))}
              </div>
              <PriorityHandler priority={task.priority} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Select
            onValueChange={(value) => handleChange("status", value)}
            value={editableTask.status}
          >
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
          <InfoLabel name={task.status} />
        )}
      </td>
      <td className="py-2 px-2">
        {isEditing ? (
          <Select
            onValueChange={(value) => handleChange("priority", value)}
            value={editableTask.priority}
          >
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
          <PriorityHandler priority={task.priority} />
        )}
      </td>
      <td className="py-2 px-4">
        <AssignedUsers
          assignedUserIds={task.assign?.map(Number)}
          getAssignedUser={getAssignedUser(task.assign?.map(Number))}
        />
      </td>
      <td className="py-2 px-4">
        <InfoLabel name={getSprintNames(task.sprints).join(", ") || "None"} />
      </td>
      <td className="py-2 px-4">
        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSaveClick} className="text-green-500">
              Save
            </Button>
          ) : (
            <PencilLineIcon
              onClick={() => setIsEditing(true)}
              className="h-5 w-5 text-gray-500 cursor-pointer"
            />
          )}
          {task.deleted ? (
            <button onClick={() => undoDeleteTask(task.id)} className="text-blue-500">
              Undo
            </button>
          ) : (
            <>
              <button onClick={() => softDeleteTask(task.id)} className="text-red-500">
                <DeleteIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TaskCard;
