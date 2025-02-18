import { PRIORITIES_LIST } from "@/constants/tasks";
import TaskColumn from "./TaskColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Kanban = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 p-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        {PRIORITIES_LIST.map((priority) => (
          <TaskColumn key={priority} priority={priority} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Kanban;
