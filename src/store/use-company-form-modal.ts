import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Company } from "@/types";

interface ShareModalState {
  isOpen: boolean;
  data: Company;
  openModal: (data?: Company) => void;
  closeModal: () => void;
}

export const useCompanyFormModal = create<ShareModalState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "company-form-modal",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
