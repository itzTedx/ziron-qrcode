"use client";

import Link from "next/link";
import { memo, useCallback, useState } from "react";

import { IconCheck, IconChevronRight, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/responsive-modal";
import {
  InfoTooltip,
  SimpleTooltipContent,
} from "@/components/ui/custom/tooltip";
import { Separator } from "@/components/ui/separator";
import { useShareModalStore } from "@/store/use-share-modal";

import { Icons } from "../../assets/icons";
import QRCodeDownload from "../../qr-code-download";
import { Button } from "../../ui/button";

const CopyButton = memo(({ copied }: { copied: boolean }) => (
  <Button
    className="text-gray-600"
    size="smallIcon"
    type="button"
    variant="ghost"
  >
    {copied ? (
      <IconCheck className="size-4" />
    ) : (
      <IconCopy className="size-4" />
    )}
  </Button>
));
CopyButton.displayName = "CopyButton";

const ViewInBrowserButton = memo(() => (
  <Button className="text-gray-600" size="smallIcon" variant="ghost">
    <IconChevronRight className="size-4" />
  </Button>
));
ViewInBrowserButton.displayName = "ViewInBrowserButton";

export default function ShareModal() {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, data, closeModal } = useShareModalStore();

  const copyLink = useCallback(async () => {
    if (isLoading || copied) return;

    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(data.url);
      toast.success("Link Copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link");
    } finally {
      setIsLoading(false);
    }
  }, [data.url, copied, isLoading]);

  return (
    <ResponsiveModal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Share card"
      className="max-w-lg"
    >
      <div className="space-y-1 p-6 pt-0">
        <QRCodeDownload data={data} />
        <Separator />
        <button
          className="flex w-full items-center justify-between gap-6 rounded-xl p-3 transition-colors hover:bg-gray-50 disabled:opacity-50"
          onClick={copyLink}
          disabled={isLoading}
        >
          <div className="flex cursor-pointer items-center gap-4">
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full border border-secondary bg-purple-100 text-secondary">
              <Icons.link />
            </div>
            <div className="w-full">
              <h5 className="w-full text-start font-semibold">
                {copied ? "Link Copied!" : "Copy Link"}
              </h5>
              <p className="line-clamp-1 w-full text-start text-xs font-light">
                {data.url}
              </p>
            </div>
          </div>
          <CopyButton copied={copied} />
        </button>

        <Link
          href={data.url}
          target="_blank"
          className="flex items-center justify-between gap-6 rounded-xl p-3 transition-colors hover:bg-gray-50"
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
          <ViewInBrowserButton />
        </Link>
      </div>
    </ResponsiveModal>
  );
}
