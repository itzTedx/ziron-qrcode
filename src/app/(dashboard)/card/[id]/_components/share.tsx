"use client";

import { IconShare3 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useModal } from "@/store/use-modal";

export default function Share() {
  const modal = useModal();
  return (
    <Button size="icon" variant="ghost" onClick={() => modal.isOpen}>
      <IconShare3 />
    </Button>
  );
}
