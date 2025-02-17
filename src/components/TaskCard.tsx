import React, { useEffect, useRef, useState } from "react";
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
import AssignedUsers from "./AssignedUsers";
import { useDataViewStore } from "@/store/useDataViewStore";
import PriorityHandler from "./PriorityHandler";
import InfoLabel from "./InfoLabel";
import { Checkbox } from "@/components/ui/checkbox";
import TableActions from "@/components/Table/TableActions";
import { Input } from "./ui/input";
import { useTaskDetailsModalStore } from "@/store/useTaskDetailsModalStore";
import { Task } from "@/types/Tasks"; // Assuming you have a Task type defined in your types file

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const { softDeleteTask, getAssignedUser, getSprintNames, moveTask, customColumns } =
    useTaskStore();
  const toggleSelection = useDataViewStore((state) => state.toggleSelection);
  const selectedIds = useDataViewStore((state) => state.selectedIds);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(task);
  const dataView = useDataViewStore((state) => state.dataView);
  const { openModal } = useTaskDetailsModalStore();

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index, priority: task.priority },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Only use drop for table view
  const [, drop] = useDrop({
    accept: "TASK",
    hover(item: { index: number }) {
        moveTask(item.index, index, false);
        item.index = index;
    },
  });

  // Apply refs correctly based on view
  useEffect(() => {
    if (ref.current) {
      if (dataView === "kanban") {
        drag(ref.current);
      } else {
        drag(drop(ref.current));
      }
    }
  }, [drag, drop, dataView]);

  const handleChange = (field: keyof typeof editableTask, value: any) => {
    setEditableTask({ ...editableTask, [field]: value });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isEditing) return;

    // Check if the clicked element is an interactive element
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      e.stopPropagation(); // Prevent modal from opening
      return;
    }

    openModal(task);
  };
  if (dataView === "kanban") {
    return (
      <div ref={ref} key={task.id}>
        <Card
          onClick={handleCardClick}
          className={`${selectedIds.includes(task.id) && "border-gray-500 "} ${isDragging ? "opacity-50" : ""} cursor-pointer hover:border-black`}
        >
          <CardHeader className="flex">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedIds.includes(task.id)}
                onCheckedChange={() => toggleSelection(task.id)}
              />
              <CardTitle className="font-semibold">{task.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              <AssignedUsers getAssignedUser={getAssignedUser(task.assign?.map(Number))} />
            </CardDescription>
            <div className="flex gap-2 items-center pt-5">
              <InfoLabel name={`#${task.id}`} />
              {getSprintNames(task.sprints).map((sprint, index) => (
                <InfoLabel name={sprint} key={`${sprint}-${index}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <tr
      key={task.id}
      onClick={handleCardClick}
      className={`cursor-pointer border-b h-12 table-fixed w-full hover:bg-gray-200 dark:hover:bg-gray-800 
        ${selectedIds.includes(task.id as number) ? "bg-gray-100 dark:bg-gray-800" : ""} 
        ${isDragging ? "opacity-50" : ""}`}
    >
      <td className="py-2 pl-2">
        <Checkbox
          checked={selectedIds.includes(task.id as number)}
          onClick={() => toggleSelection(task.id  as number)}
        />
      </td>
      <td className="w-[420px] truncate whitespace-wrap overflow-hidden">
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
      {customColumns.map((column) => (
        <td key={column.key} className="py-2 px-4">
          {isEditing ? (
            column.type === "checkbox" ? (
              <Checkbox
                checked={editableTask[column.key]}
                onCheckedChange={(checked) => handleChange(column.key, checked)}
              />
            ) : (
              <Input
                type={column.type}
                value={editableTask[column.key]}
                onChange={(e) => handleChange(column.key, e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            )
          ) : column.type === "checkbox" ? (
            <Checkbox checked={task[column.key]} disabled />
          ) : (
            task[column.key]
          )}
        </td>
      ))}
      <td className="py-2 px-4">
        <TableActions
          task={task}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          softDeleteTask={softDeleteTask}
          editableTask={editableTask}
        />
      </td>
    </tr>
  );
};

export default TaskCard;
