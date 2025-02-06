"use client";

import Image from "next/image";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useCompanyFormModal } from "@/store/use-company-form-modal";

export const NothingFound = () => {
  const openModal = useCompanyFormModal((state) => state.openModal);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background py-9">
      <Image
        src="/not-available.svg"
        height={200}
        width={200}
        alt="No Cards Available"
      />

      <p className="pt-2 font-semibold text-muted-foreground">
        No Cards or Company Available
      </p>
      <Button
        className="gap-2"
        onClick={() => {
          openModal();
        }}
      >
        <IconPlus className="size-4" /> Add Company
      </Button>
    </div>
  );
};
