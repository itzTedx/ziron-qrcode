"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import {
  IconArrowRight,
  IconChevronRight,
  IconCopy,
} from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import { Icons } from "@/components/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { card } from "@/constants";
import { cn } from "@/lib/utils";

export default function ProfileDashboard() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const shareLink = " https://app.zironmedia.com/sridhun_prakash_ziron-media"; // Replace with your actual share link

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link Copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadSVG = () => {
    const svg = svgRef.current;

    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);

      // Create a blob from the SVG string
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
      const link = document.createElement("a");
      link.href = url;
      link.download = `${card.name}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="-mt-20">
      <div className="h-48 bg-yellow-500"></div>
      <div className="container relative -mt-12 grid max-w-6xl grid-cols-10 divide-x rounded-lg bg-background py-6 shadow-lg shadow-muted/30">
        <div className="col-span-4 flex justify-between px-6">
          <div className="absolute -top-1/2 left-5 size-36 translate-y-1/3 overflow-hidden rounded-full border-4 border-background">
            <Image src="/sridhun.jpg" fill alt="Profile Image" quality={25} />
          </div>
          <div className="ml-32">
            <Badge variant="secondary">{card.company.name}</Badge>
            <h2 className="text-2xl font-semibold">{card.name}</h2>
            <p className="text-sm">{card.designation}</p>
          </div>
          <span>Edit</span>
        </div>

        <div className="col-span-4 flex items-center justify-between gap-4 px-6">
          <div className="w-full space-y-2">
            <h3>Link</h3>
            <Input
              readOnly
              className="w-full bg-gray-50"
              defaultValue={"https://zironmedia.com/sridhun-prakash"}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-nowrap text-sm">
              Customize url <IconArrowRight className="size-4" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex items-center gap-1.5"
                >
                  <Icons.share className="size-4 stroke-[1.5]" />
                  Share url
                </Button>
              </DialogTrigger>
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
                          <p className="line-clamp-1 text-sm">
                            https://app.zironmedia.com/sridhun_prakash_ziron-media
                          </p>
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
                      href="/"
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
                  <div className="flex flex-col items-center justify-center gap-6 px-9 pb-6">
                    <QRCodeSVG
                      ref={svgRef}
                      value={shareLink}
                      size={256}
                      imageSettings={{
                        src: `${process.env.NEXT_PUBLIC_BASE_PATH}/${card.company.logo}`,
                        x: undefined,
                        y: undefined,
                        height: 50,
                        width: 50,
                        opacity: 1,
                        excavate: true,
                      }}
                    />
                    <div className="flex w-full flex-col gap-3">
                      <Button className="w-full" onClick={downloadSVG}>
                        Download
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => setStep(1)}
                        variant="outline"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-3 px-6">
          <Button
            variant="outline"
            className="border-destructive text-destructive"
          >
            Delete
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
