import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  taskDetails: any | null;
  openModal: (taskDetails: any) => void;
  closeModal: () => void;
}

export const useTaskDetailsModalStore = create<ModalState>((set) => ({
  isOpen: false,
  taskDetails: null,
  openModal: (taskDetails) => {
    console.log("Opening modal with task details:", taskDetails);
    set({ isOpen: true, taskDetails });
  },
  closeModal: () => {
    console.log("Closing modal");
    set({ isOpen: false, taskDetails: null });
  },
}));
