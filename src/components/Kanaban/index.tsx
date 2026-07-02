import { PRIORITIES_LIST } from "@/constants/tasks";
import TaskColumn from "./TaskColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Kanban = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* px-3 + each column's px-1 inner gutter = 16px, so cards/headers line up
          with the page's p-4 content (the "Issues" title) while the gutter keeps
          the card ring from being clipped by the column's scroll area. */}
      <div className="p-3">
      <div className="flex snap-x items-start gap-4 overflow-x-auto scroll-smooth px-3 pb-4 pt-1 [scrollbar-width:thin]">
        {PRIORITIES_LIST.map((priority) => (
          <TaskColumn key={priority} priority={priority} />
        ))}
      </div></div>
    </DndProvider>
  );
};

export default Kanban;
