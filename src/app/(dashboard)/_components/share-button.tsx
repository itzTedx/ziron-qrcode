"use client";

import { IconShare } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useShareModalStore } from "@/store/use-share-modal";

interface ShareButtonProps {
  data: {
    url: string;
    name: string;
    logo: string | null; // Ensure logo can be null
  };
}

export default function ShareButton({ data }: ShareButtonProps) {
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_PATH}/id/${data.url}`;

  const shareData = {
    url: shareLink,
    name: data.name,
    logo: data.logo || undefined,
  };

  const openModal = useShareModalStore((state) => state.openModal);

  return (
    <Button
      className="gap-1.5 text-sm sm:w-full"
      onClick={() => openModal(shareData)}
    >
      <IconShare className="size-4" />{" "}
      <span className="hidden sm:block">Share</span>
    </Button>
  );
}
