"use client";

import Link from "next/link";
import { useState } from "react";

import { IconChevronRight, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useShareModalStore } from "@/store/use-share-modal";

import { Icons } from "../assets/icons";
import QRCodeDownload from "../qr-code-download";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function ShareModal() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const { isOpen, url, name, closeModal } = useShareModalStore();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link Copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className={cn(
          "p-0 transition-[max-width]",
          step === 1 ? "max-w-xl" : "max-w-max"
        )}
      >
        <DialogHeader className="border-b p-9">
          <DialogTitle>
            {step === 1 ? "Share Card" : "Download QR Code"}
          </DialogTitle>
        </DialogHeader>
        {step === 1 ? (
          <div className="divide-y p-9 pt-0">
            <div
              onClick={copyLink}
              className="flex items-center justify-between gap-6 py-6"
            >
              <div className="flex cursor-pointer items-center gap-4">
                <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full border border-secondary bg-purple-100 text-secondary">
                  <Icons.link />
                </div>
                <div className="">
                  <h5 className="font-semibold">
                    {copied ? "Link Copied!" : "Copy Link"}
                  </h5>
                  <p className="line-clamp-1 text-sm">{url}</p>
                </div>
              </div>
              <Button
                className="text-secondary hover:text-purple-700"
                size="icon"
                variant="ghost"
              >
                <IconCopy />
              </Button>
            </div>
            <div
              onClick={() => setStep(2)}
              className="group flex items-center justify-between gap-6 py-6"
            >
              <div className="flex cursor-pointer items-center gap-4">
                <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full border border-secondary bg-purple-100 text-secondary">
                  <Icons.qrcode />
                </div>
                <div className="">
                  <h5 className="font-semibold">Get QR Code</h5>
                  <p className="line-clamp-1 text-sm">
                    Download qr code and share
                  </p>
                </div>
              </div>
              <Button
                className="text-secondary hover:text-purple-700"
                size="icon"
                variant="ghost"
              >
                <IconChevronRight className="size-4" />
              </Button>
            </div>
            <Link
              href={url}
              target="_blank"
              className="flex items-center justify-between gap-6 pb-3 pt-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full border border-secondary bg-purple-100 text-secondary">
                  <Icons.window />
                </div>
                <div className="">
                  <h5 className="font-semibold">View in browser</h5>
                  <p className="line-clamp-1 text-sm">
                    Open profile page in new tab
                  </p>
                </div>
              </div>
              <Button
                className="text-secondary hover:text-purple-700"
                size="icon"
                variant="ghost"
              >
                <IconChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <QRCodeDownload
            shareLink={url}
            cardName={name}
            onBack={() => setStep(1)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
