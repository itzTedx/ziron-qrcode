"use client";

import CompanyForm from "@/app/(dashboard)/company/company-form";
import { useCompanyFormModal } from "@/store/use-company-form-modal";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function CompanyFormModal() {
  const { isOpen, data, closeModal } = useCompanyFormModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <CompanyForm initialData={data} />
      </DialogContent>
    </Dialog>
  );
}
