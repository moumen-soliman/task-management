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
    set({ isOpen: true, taskDetails });
  },
  closeModal: () => {
    set({ isOpen: false, taskDetails: null });
  },
}));
