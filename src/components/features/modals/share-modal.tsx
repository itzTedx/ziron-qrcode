"use client";

import Link from "next/link";
import { useState } from "react";

import { IconCheck, IconChevronRight, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

import {
  InfoTooltip,
  SimpleTooltipContent,
} from "@/components/ui/custom/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useShareModalStore } from "@/store/use-share-modal";

import { Icons } from "../../assets/icons";
import QRCodeDownload from "../../qr-code-download";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export default function ShareModal() {
  const [copied, setCopied] = useState(false);

  const { isOpen, data, closeModal } = useShareModalStore();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.url);
      toast.success("Link Copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className={cn("p-0", "max-w-xl")}>
        <DialogHeader className="border-b p-6">
          <DialogTitle>Share Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-6 pt-0">
          <QRCodeDownload data={data} />
          <Separator />
          <div className="flex items-center justify-between gap-6">
            <div className="flex cursor-pointer items-center gap-4">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border border-secondary bg-purple-100 text-secondary">
                <Icons.link />
              </div>
              <div className="">
                <h5 className="font-semibold">
                  {copied ? "Link Copied!" : "Copy Link"}
                </h5>
                <p className="line-clamp-1 text-xs font-light">{data.url}</p>
              </div>
            </div>
            <Button
              onClick={copyLink}
              className="text-gray-600"
              size="smallIcon"
              variant="ghost"
            >
              {copied ? (
                <IconCheck className="size-4" />
              ) : (
                <IconCopy className="size-4" />
              )}
            </Button>
          </div>

          <Link
            href={data.url}
            target="_blank"
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border border-secondary bg-purple-100 text-secondary">
                <Icons.window />
              </div>
              <div className="flex items-center gap-2">
                <h5 className="font-semibold">View in browser</h5>
                <InfoTooltip
                  content={
                    <SimpleTooltipContent title=" Open profile page in new tab." />
                  }
                />
              </div>
            </div>
            <Button className="text-gray-600" size="smallIcon" variant="ghost">
              <IconChevronRight className="size-4" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
