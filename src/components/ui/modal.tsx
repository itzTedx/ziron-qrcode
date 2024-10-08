"use client";

import { useModal } from "@/store/use-modal";

import { Dialog, DialogContent } from "./dialog";

export default function Modal({ children }: { children: React.ReactNode }) {
  const { isOpen, onClose, data } = useModal();

  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent>{data}</DialogContent>
    </Dialog>
  );
}
