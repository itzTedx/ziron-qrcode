"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  IconArrowRight,
  IconChevronRight,
  IconCopy,
  IconEdit,
} from "@tabler/icons-react";
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
import { cn, slugify } from "@/lib/utils";
import { Person } from "@/types/card-customize-props";

import QRCodeDownload from "./qr-code-download";
import Share from "./share";

interface ProfileDashboardProps {
  data: Person;
}

export default function ProfileDashboard({ data }: ProfileDashboardProps) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const shareLink = `https://app.zironmedia.com/${data.slug}`; // Replace with your actual share link

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

  console.log(data);

  return (
    <div className="-mt-20">
      <div
        className="h-52 bg-secondary md:h-48"
        style={{
          backgroundImage: `url("${data.cover}")`,
        }}
      ></div>
      <div className="container relative -mt-12 grid max-w-6xl grid-cols-10 rounded-lg bg-background py-6 shadow-lg shadow-muted/30 md:divide-x">
        <div className="col-span-10 flex md:col-span-4 md:px-3 lg:px-6">
          <div className="absolute -top-1/2 left-5 size-28 translate-y-6 overflow-hidden rounded-full border-4 border-background md:size-36 md:translate-y-1/3">
            <Image src={data.image} fill alt="Profile Image" quality={25} />
          </div>
          <div className="w-full max-md:mt-9 md:ml-32">
            <div className="flex justify-between gap-3">
              <Badge variant="secondary">{data.company.name}</Badge>
              <span className="flex gap-3 text-primary md:hidden">
                <IconEdit />
                <Share />
              </span>
            </div>
            <h2 className="text-lg font-semibold lg:text-2xl">{data.name}</h2>
            <p className="text-sm">{data.designation}</p>
          </div>
        </div>

        <div className="col-span-10 flex items-center justify-between gap-4 md:col-span-4 md:px-3 lg:px-6">
          <div className="w-full space-y-2 max-md:hidden">
            <h3 className="max-md:text-xs">Link</h3>
            <Input
              readOnly
              className="w-full flex-shrink-0 bg-gray-50"
              defaultValue={shareLink}
            />
          </div>
          <div className="space-y-2">
            <div className="hidden items-center gap-1.5 text-nowrap text-xs md:flex md:text-sm">
              Customize url <IconArrowRight className="size-3 md:size-4" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="hidden items-center gap-1.5 md:flex"
                >
                  <Icons.share className="size-4 stroke-[1.5]" />
                  <span>
                    Share <span className="max-md:hidden">url</span>
                  </span>
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
                          <p className="line-clamp-1 text-sm">{shareLink}</p>
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
                      href={`/id/${slugify(card.name)}`}
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
                    shareLink={shareLink}
                    logo={`${process.env.NEXT_PUBLIC_BASE_PATH}${card.company.logo}`}
                    cardName={card.name}
                    onBack={() => setStep(1)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="col-span-2 hidden flex-col gap-3 px-6 md:flex">
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
