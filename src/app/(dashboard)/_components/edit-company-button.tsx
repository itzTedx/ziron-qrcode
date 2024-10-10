"use client";

import { IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useCompanyFormModal } from "@/store/use-company-form-modal";
import { Company } from "@/types/card-customize-props";

interface EditButtonProps {
  initialData: Company;
}

export default function EditCompanyButton({ initialData }: EditButtonProps) {
  const openModal = useCompanyFormModal((state) => state.openModal);
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => openModal(initialData)}
    >
      <IconEdit className="size-4" />
    </Button>
  );
}
