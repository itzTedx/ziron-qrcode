import { create } from "zustand";

import { Link } from "@/types";

interface AddLinkModalProps {
  isOpen: boolean;
  index?: number;
  openModal: (index?: number) => void;
  closeModal: () => void;
  data: Link[];
  category: string;
  setCategory: (category: string) => void;
  setData: (data: Link[]) => void;
}

export const useAddLinkModal = create<AddLinkModalProps>((set) => ({
  isOpen: false,
  index: 0,
  data: [],
  category: "",
  openModal: (index) => set({ isOpen: true, index }),
  closeModal: () => set({ isOpen: false }),
  setCategory: (category) => set({ category }),
  setData: (newData) => set((state) => ({ data: [...state.data, ...newData] })), // Append new data
}));
