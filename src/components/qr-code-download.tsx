"use client";

import { PropsWithChildren, useMemo, useRef, useState } from "react";

import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconPhoto,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/hooks/use-copy";
import { getQRAsCanvas, getQRAsSVGDataUri, getQRData } from "@/lib/qr";

import { Icons } from "./assets/icons";
import { QRCode } from "./qr-code";
import { Button } from "./ui/button";
import { IconMenu } from "./ui/custom/icon-menu";
import { Popover } from "./ui/custom/popover";
import {
  ButtonTooltip,
  InfoTooltip,
  SimpleTooltipContent,
} from "./ui/custom/tooltip";
import { Label } from "./ui/label";
import { ShimmerDots } from "./ui/shimmer-dots";
import { Switch } from "./ui/switch";

// Import the new function

interface QRCodeDownloadProps {
  data: { url: string; name: string; logo?: string };
}

export default function QRCodeDownload({ data }: QRCodeDownloadProps) {
  const [checked, setChecked] = useState<boolean>(true);

  const qrData = useMemo(
    () =>
      getQRData({
        url: data.url || "",
        fgColor: "#000",
        hideLogo: checked,
        logo: data.logo,
      }),
    [data, checked]
  );

  return (
    <div className="space-y-3 px-3 pb-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          QR Code Preview
          <InfoTooltip
            content={
              <SimpleTooltipContent title="Customize your QR code to fit your brand." />
            }
          />
        </Label>
        <div className="flex items-center gap-2">
          <DownloadPopover qrData={qrData} props={data.name}>
            <Button
              className="flex h-6 w-6 items-center justify-center rounded-md bg-transparent px-0 text-gray-500 transition-colors duration-75 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              type="button"
            >
              <IconDownload className="size-4 shrink-0 text-gray-500" />
            </Button>
          </DownloadPopover>
          <CopyPopover qrData={qrData}>
            <div>
              <ButtonTooltip
                tooltipProps={{
                  content: "Copy QR code",
                }}
              >
                <IconCopy className="size-4 text-gray-500" />
              </ButtonTooltip>
            </div>
          </CopyPopover>
        </div>
      </div>
      <div className="relative flex items-center justify-center gap-6 rounded-lg border bg-gray-50 p-6">
        <ShimmerDots className="opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ filter: "blur(2px)", opacity: 0.4 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(2px)", opacity: 0.4 }}
            transition={{ duration: 0.1 }}
            className="relative flex size-full items-center justify-center"
          >
            <QRCode
              url={data.url}
              hideLogo={checked}
              logo={data.logo}
              scale={2}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <Label
          htmlFor="logo"
          className="flex items-center gap-1.5 text-sm font-medium"
        >
          Logo
          <InfoTooltip
            content={
              <SimpleTooltipContent title="Display your logo in the center of the QR code." />
            }
          />
        </Label>

        <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
          <Switch
            id="logo"
            checked={checked}
            onCheckedChange={setChecked}
            className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
          />
          <span className="min-w-78 pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
            <span className="text-[10px] font-medium uppercase">Off</span>
          </span>
          <span className="min-w-78 foreground pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-white rtl:peer-data-[state=checked]:translate-x-full">
            <span className="text-[10px] font-medium uppercase">On</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function DownloadPopover({
  qrData,
  props,
  children,
}: PropsWithChildren<{
  qrData: ReturnType<typeof getQRData>;
  props: string;
}>) {
  const anchorRef = useRef<HTMLAnchorElement>(null);

  function download(url: string, extension: string) {
    if (!anchorRef.current) return;
    anchorRef.current.href = url;
    anchorRef.current.download = `${props}-qrcode.${extension}`;
    anchorRef.current.click();
    setOpenPopover(false);
  }

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div>
      <Popover
        content={
          <div className="grid p-3 text-foreground sm:min-w-48">
            <button
              type="button"
              onClick={async () => {
                download(await getQRAsSVGDataUri(qrData), "svg");
              }}
              className="w-full cursor-pointer rounded-md p-3 text-left text-sm font-medium outline-none transition-all duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <IconMenu
                text="Download SVG"
                icon={<Icons.svg className="size-5" />}
              />
            </button>
            <button
              type="button"
              onClick={async () => {
                download(
                  (await getQRAsCanvas(qrData, "image/png")) as string,
                  "png"
                );
              }}
              className="w-full cursor-pointer rounded-md p-3 text-left text-sm font-medium outline-none transition-all duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <IconMenu
                text="Download PNG"
                icon={<Icons.png className="size-5" />}
              />
            </button>
            <button
              type="button"
              onClick={async () => {
                download(
                  (await getQRAsCanvas(qrData, "image/jpeg")) as string,
                  "jpg"
                );
              }}
              className="w-full cursor-pointer rounded-md p-3 text-left text-sm font-medium outline-none transition-all duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <IconMenu
                text="Download JPEG"
                icon={<Icons.jpg className="size-5" />}
              />
            </button>
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        {children}
      </Popover>
      {/* This will be used to prompt downloads. */}
      <a className="hidden" download={`${props}-qrcode.svg`} ref={anchorRef} />
    </div>
  );
}

function CopyPopover({
  qrData,
  children,
}: PropsWithChildren<{
  qrData: ReturnType<typeof getQRData>;
}>) {
  const [openPopover, setOpenPopover] = useState(false);
  const [copiedImage, copyImageToClipboard] = useCopyToClipboard(2000);

  const copyToClipboard = async () => {
    try {
      const canvas = await getQRAsCanvas(qrData, "image/png", true);
      if (canvas instanceof HTMLCanvasElement) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const item = new ClipboardItem({ "image/png": blob });
            await copyImageToClipboard(item);
            setOpenPopover(false);
          }
        });
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <Popover
      content={
        <div className="grid gap-2 p-3 sm:min-w-48">
          <button
            type="button"
            onClick={async () => {
              toast.promise(copyToClipboard, {
                loading: "Copying QR code to clipboard...",
                success: "Copied QR code to clipboard!",
                error: "Failed to copy",
              });
            }}
            className="rounded-md p-4 text-left text-sm font-medium transition-all duration-75 hover:bg-gray-50"
          >
            <IconMenu
              text="Copy Image"
              icon={
                copiedImage ? (
                  <IconCheck className="size-4" />
                ) : (
                  <IconPhoto className="size-4" />
                )
              }
            />
          </button>
        </div>
      }
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      {children}
    </Popover>
  );
}
