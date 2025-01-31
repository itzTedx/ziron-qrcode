"use client";

import Link from "next/link";
import { memo } from "react";

import { IconArrowRight, IconExternalLink, IconX } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@/components/assets/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadDropzone } from "@/lib/uploadthing";
import { zCardSchema } from "@/types/card-schema";
import { removeExtension } from "@/utils/remove-extension";

// Extracted components for better performance
const PdfCompressorLink = memo(() => (
  <Link
    target="_blank"
    href="https://www.ilovepdf.com/compress_pdf"
    className="flex items-center gap-1 px-2 text-xs font-medium text-primary hover:underline"
  >
    Pdf Compressor
    <IconArrowRight className="size-3" />
  </Link>
));
PdfCompressorLink.displayName = "PdfCompressorLink";

const AttachmentPreview = memo(
  ({
    url,
    filename,
    onRemove,
  }: {
    url: string;
    filename: string;
    onRemove: () => void;
  }) => (
    <Card className="flex justify-between gap-3 p-3">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5"
      >
        <Icons.pdf className="h-6" />
        <p className="line-clamp-1 text-sm font-medium">
          {removeExtension(filename)}
        </p>
        <IconExternalLink className="size-4 stroke-1 text-muted-foreground" />
      </Link>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-red-600 hover:text-red-100"
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
      >
        <IconX className="size-5" />
      </Button>
    </Card>
  )
);
AttachmentPreview.displayName = "AttachmentPreview";

export const AttachmentUpload = memo(
  ({
    setLoading,
    url,
    filename,
  }: {
    setLoading: (loading: boolean) => void;
    url?: string;
    filename?: string;
  }) => {
    const form = useFormContext<zCardSchema>();

    const handleUploadComplete = (res: { url: string; name: string }[]) => {
      setLoading(false);
      // Batch form updates
      form.setValue("attachmentUrl", res[0].url, { shouldDirty: true });
      form.setValue("attachmentFileName", res[0].name, { shouldDirty: true });
      toast.dismiss();
      toast.success("Attachment uploaded");
    };

    const handleRemove = () => {
      // Batch form updates
      form.setValue("attachmentFileName", undefined, { shouldDirty: true });
      form.setValue("attachmentUrl", undefined, { shouldDirty: true });
    };

    return (
      <FormField
        control={form.control}
        name="cover"
        render={() => (
          <FormItem className="col-span-2">
            <FormLabel className="flex items-center justify-between text-base font-normal">
              Attachments
              <PdfCompressorLink />
            </FormLabel>
            <FormControl>
              <UploadDropzone
                endpoint="attachments"
                onUploadBegin={() => {
                  setLoading(true);
                  toast.loading("Uploading attachment file...");
                }}
                onUploadError={(error) => {
                  setLoading(false);
                  form.setError("attachmentUrl", {
                    type: "validate",
                    message: error.message,
                  });
                }}
                onClientUploadComplete={handleUploadComplete}
                config={{ mode: "auto" }}
              />
            </FormControl>
            <FormMessage />
            {filename && url && (
              <AttachmentPreview
                url={url}
                filename={filename}
                onRemove={handleRemove}
              />
            )}
          </FormItem>
        )}
      />
    );
  }
);
AttachmentUpload.displayName = "AttachmentUpload";
