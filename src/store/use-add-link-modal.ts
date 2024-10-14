import { create } from "zustand";

interface AddLinkModalProps {
  isOpen: boolean;
  index?: number;
  openModal: (index?: number) => void;
  closeModal: () => void;
}

export const useAddLinkModal = create<AddLinkModalProps>((set) => ({
  isOpen: false,
  index: 0,
  openModal: (index) => set({ isOpen: true, index }),
  closeModal: () => set({ isOpen: false }),
}));
