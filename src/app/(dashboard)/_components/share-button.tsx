"use client";

import { IconShare } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useShareModalStore } from "@/store/use-share-modal";

export default function ShareButton({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_PATH}/id/${slug}`;

  const openModal = useShareModalStore((state) => state.openModal);

  return (
    <Button
      className="w-full gap-1.5 text-sm"
      onClick={() => openModal(shareLink, name)}
    >
      <IconShare className="size-4" /> Share
    </Button>
  );
}
