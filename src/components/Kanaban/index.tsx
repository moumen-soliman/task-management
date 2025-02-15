"use client";

import { useContext } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { STATUS_LIST } from "@/constants/tasks";
import { useTaskStore } from "@/store/useTaskStore";
import { Task } from "@/types/Tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskActionContext } from "./BoardContainer";
import { useFilteredTasks } from "@/store/useDataViewStore";
import AssignedUsers from "../AssignedUsers";

const Kanban = () => {
  const { updateTaskStatus } = useTaskStore();
  const filteredTasks = useFilteredTasks();
 const getAssignedUser = useTaskStore((state) => state.getAssignedUser);

  const moveTask = (taskId: number, newStatus: string) => {
    updateTaskStatus(taskId, newStatus);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: { id: task.id, status: task.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        key={task.id}
        className={`p-2 rounded-lg shadow-sm ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              {task.description}
            </CardDescription>
            <CardDescription className="text-sm text-gray-600">
                      <AssignedUsers getAssignedUser={getAssignedUser(task.assign?.map(Number))} />
            
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  };

  const TaskColumn = ({ status }: { status: string }) => {
    const [, drop] = useDrop({
      accept: "TASK",
      drop: (item: { id: number; status: string }) => {
        moveTask(item.id, status);
      },
    });

    return (
      <ScrollArea
        ref={drop}
        key={status}
        className="flex-1 p-4 rounded-lg border h-[80vh]"
      >
        <h2 className="text-xl font-bold mb-4 capitalize">{status.replaceAll("_", " ")}</h2>
        <div className="space-y-2">
          {filteredTasks
            ?.filter((task) => task.status === status)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 p-4">
        {STATUS_LIST.map((status) => (
          <TaskColumn key={status} status={status} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Kanban;
