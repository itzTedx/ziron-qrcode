import { create } from "zustand";

interface ModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: any;
  setData: (data: any) => void;
}

export const useModal = create<ModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
  data: {},
  setData: (data) => set({ data: { data } }),
}));
