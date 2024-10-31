import { create } from "zustand";

interface ShareModalState {
  isOpen: boolean;
  data: { url: string; name: string; logo?: string };

  // name: string;
  openModal: (
    data: { url: string; name: string; logo?: string },
    title?: string
  ) => void;
  closeModal: () => void;
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  isOpen: false,
  data: { url: "", name: "", logo: "" },
  // name: "Share Card",
  openModal: (
    data: { url: string; name: string; logo?: string }
    // name: string = "Share Card"
  ) => set({ isOpen: true, data }),
  closeModal: () => set({ isOpen: false }),
}));
