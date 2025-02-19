import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useTaskStore } from "@/store/useTaskStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Status, Priorities } from "@/types/Tasks";

const SelectedActionsAlert = () => {
  const selectedIds = useDataViewStore((state) => state.selectedIds);
  const clearSelection = useDataViewStore((state) => state.clearSelection);
  const softDeleteTask = useTaskStore((state) => state.softDeleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [showAlert, setShowAlert] = useState(false);
  const [newStatus, setNewStatus] = useState("none");
  const [newPriority, setNewPriority] = useState("none");

  useEffect(() => {
    setShowAlert(selectedIds.length > 0);
  }, [selectedIds]);

  const handleStatusChange = (status: Status) => {
    setNewStatus(status);
  };

  const handlePriorityChange = (priority: Priorities) => {
    setNewPriority(priority);
  };

  const applyChanges = () => {
    if (newStatus !== "none") {
      selectedIds.forEach((id) => updateTask(id, { status: newStatus as Status }));
    }
    if (newPriority !== "none") {
      selectedIds.forEach((id) => updateTask(id, { priority: newPriority as Priorities }));
    }
    clearSelection();
    setShowAlert(false);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => softDeleteTask(id));
    clearSelection();
    setShowAlert(false);
  };

  if (!showAlert) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-96 z-10 shadow-md">
      <AlertTitle className="flex items-center justify-between">
        {selectedIds.length} Items Selected <EyeIcon className="animate-pulse" />
      </AlertTitle>
      <AlertDescription>You can now perform bulk actions on the selected items.</AlertDescription>
      <AlertDescription className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Edit Selected</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Bulk Edit {selectedIds.length} Tasks</DialogTitle>
              <DialogDescription>
                Change status or priority for all selected tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"></div>
              <h4 className="text-sm font-medium">Status</h4>
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"none"}>No Change</SelectItem>
                  {STATUS_LIST.map((status) => (
                    <SelectItem className="capitalize" key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Priority</h4>
              <Select onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"none"}>No Change</SelectItem>
                  {PRIORITIES_LIST.map((priority) => (
                    <SelectItem className="capitalize" key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  applyChanges();
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ConfirmDeleteDialog onDelete={() => handleBulkDelete()} />
      </AlertDescription>
    </Alert>
  );
};

export default SelectedActionsAlert;
