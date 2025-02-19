import { useTaskDetailsModalStore } from "@/store/useTaskDetailsModalStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import AssignedUsers from "./AssignedUsers";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import InfoLabel from "./InfoLabel";
import PriorityHandler from "./PriorityHandler";
import { SKIPED_KEYS } from "@/constants/tasks";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function TaskDetailsModal() {
  const { isOpen, taskDetails, closeModal } = useTaskDetailsModalStore();
  const getAssignedUser = useTaskStore((state) => state.getAssignedUser);
  const openSheet = useSheetStore((state) => state.openSheet);
  const getSprintNames = useTaskStore((state) => state.getSprintNames);
  const softDeleteTask = useTaskStore((state) => state.softDeleteTask);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-[70vw]">
        <DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <InfoLabel name={`#${taskDetails?.id}`} />
              <InfoLabel name={taskDetails?.status} />
              {taskDetails?.sprints && (
                <InfoLabel name={getSprintNames(taskDetails.sprints).join(", ") || "None"} />
              )}
              <PriorityHandler priority={taskDetails?.priority} />
              {taskDetails?.assign && (
                <div className="space-y-2">
                  <AssignedUsers
                    assignedUserIds={taskDetails.assign?.map(Number)}
                    getAssignedUser={getAssignedUser(taskDetails.assign?.map(Number))}
                  />
                </div>
              )}
            </div>
            <DialogTitle>{taskDetails?.title || "Task Details"}</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea style={{ maxHeight: "300px", padding: "8px" }}>
          <div>
            {taskDetails?.description ? (
              <div dangerouslySetInnerHTML={{ __html: taskDetails?.description }} />
            ) : (
              "No description available"
            )}
          </div>

          <Separator style={{ margin: "12px 0" }} />

          <div className="space-y-3">
            {taskDetails &&
              Object.entries(taskDetails)?.map(([key, value]) => {
                if (SKIPED_KEYS.includes(key)) return null;

                return (
                  <div key={key} className="flex gap-1 items-center">
                    <Label className="font-medium">{key}: </Label>
                    {typeof value === "boolean" ? (
                      <Checkbox checked={value} disabled />
                    ) : (
                      <span>{value as React.ReactNode}</span>
                    )}
                  </div>
                );
              })}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              openSheet("edit", taskDetails.id);
              closeModal();
            }}
          >
            Edit
          </Button>
          <ConfirmDeleteDialog
            onDelete={() => {
              softDeleteTask(taskDetails.id);
              closeModal();
            }}
          />
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
