import { create } from "zustand";

interface ShareModalState {
  isOpen: boolean;

  openModal: () => void;
  closeModal: () => void;
}

export const useAddLinkModal = create<ShareModalState>((set) => ({
  isOpen: false,

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
