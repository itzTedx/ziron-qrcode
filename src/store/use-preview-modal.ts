import { create } from "zustand";

interface PreviewModalState {
  isOpen: boolean;

  onOpenChange: () => void;
}

export const usePreviewModalStore = create<PreviewModalState>((set) => ({
  isOpen: false,

  onOpenChange: () => set((state) => ({ isOpen: !state.isOpen })),
}));
