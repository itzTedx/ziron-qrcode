import { create } from "zustand";

interface ShareModalState {
  isOpen: boolean;
  url: string;
  name: string;
  openModal: (url: string, title?: string) => void;
  closeModal: () => void;
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  isOpen: false,
  url: "",
  name: "Share Card",
  openModal: (url: string, name: string = "Share Card") =>
    set({ isOpen: true, url, name }),
  closeModal: () => set({ isOpen: false }),
}));
