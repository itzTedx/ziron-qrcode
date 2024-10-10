import { create } from "zustand";

import { Company } from "@/types/card-customize-props";

interface ShareModalState {
  isOpen: boolean;
  data: Company;
  openModal: (data?: Company) => void;
  closeModal: () => void;
}

export const useCompanyFormModal = create<ShareModalState>((set) => ({
  isOpen: false,
  data: {
    address: "",
    logo: "",
    name: "",
    phone: "",
    website: "",
  },
  openModal: (data) => set({ data, isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
