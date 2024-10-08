import { create } from "zustand";

interface ShareModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useShareModal = create<ShareModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
}));

export default useShareModal;
