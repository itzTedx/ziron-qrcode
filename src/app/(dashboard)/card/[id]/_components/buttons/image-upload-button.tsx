"use client";

// React and Next.js imports
import Image from "next/image";
import { type FC, memo, useCallback } from "react";

// Third-party imports
import { IconEdit, IconUpload, IconUser } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

// Local imports
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UploadButton } from "@/lib/uploadthing";
import { Person } from "@/types";
import { zCardSchema } from "@/types/card-schema";

interface ImageUploadButtonProps {
  /** Determines if the component is in edit mode */
  isEditMode: boolean;
  /** Card data containing person information */
  cardData: Person;
  /** Callback function to set loading state */
  setLoading: (loading: boolean) => void;
}

// Extracted button content component for better performance
const UploadButtonContent = memo(
  ({
    ready,
    isUploading,
    hasImage,
  }: {
    ready: boolean;
    isUploading: boolean;
    hasImage: boolean;
  }) => {
    if (!ready) return null;
    if (isUploading) return <div className="text-sm">Uploading...</div>;

    return (
      <div className="flex items-center gap-1.5 text-nowrap text-sm font-medium">
        {hasImage ? (
          <IconEdit className="size-4" />
        ) : (
          <IconUpload className="size-4" />
        )}
        {hasImage ? "Edit" : "Upload Photo"}
      </div>
    );
  }
);

UploadButtonContent.displayName = "UploadButtonContent";

// Extracted image preview component
const ImagePreview = memo(({ src }: { src: string }) => (
  <Image
    src={src}
    alt="Profile"
    fill
    sizes="(max-width: 80px) 100vw"
    className="object-cover"
    loading="lazy"
    priority={false}
  />
));

ImagePreview.displayName = "ImagePreview";

/**
 * ImageUploadButton Component
 * @description A component that handles image upload functionality with preview and edit capabilities
 * @param {ImageUploadButtonProps} props - Component properties
 * @returns {JSX.Element} Rendered form field with image upload functionality
 */
export const ImageUploadButton: FC<ImageUploadButtonProps> = memo(
  ({ isEditMode, cardData, setLoading }) => {
    const form = useFormContext<zCardSchema>();

    const handleUploadError = useCallback(
      (error: Error) => {
        form.setError("image", {
          type: "validate",
          message: error.message,
        });
      },
      [form]
    );

    const handleUploadComplete = useCallback(
      (res: { url: string }[]) => {
        setLoading(false);
        form.setValue("image", res[0].url);
        toast.dismiss();
        toast.success("Photo Uploaded");
      },
      [form, setLoading]
    );

    const handleUploadBegin = useCallback(() => {
      setLoading(true);
      toast.loading("Uploading photo");
    }, [setLoading]);

    if (isEditMode) return null;

    return (
      <FormField
        control={form.control}
        name="image"
        render={() => (
          <FormItem className="col-span-2">
            <FormControl>
              <div className="flex gap-3 pt-3">
                <div className="relative grid size-20 flex-shrink-0 place-items-center overflow-hidden rounded-full border bg-gray-100">
                  {cardData.image ? (
                    <ImagePreview src={cardData.image} />
                  ) : (
                    <IconUser className="size-8 text-muted-foreground/60" />
                  )}
                </div>
                <UploadButton
                  endpoint="photo"
                  className="cursor-pointer transition-all duration-500 ease-in-out ut-button:h-9 ut-button:w-fit ut-button:border ut-button:bg-transparent ut-button:px-4 ut-button:text-foreground ut-allowed-content:hidden ut-button:ut-uploading:after:bg-secondary"
                  onUploadError={handleUploadError}
                  onUploadBegin={handleUploadBegin}
                  onClientUploadComplete={handleUploadComplete}
                  content={{
                    button: ({ ready, isUploading }) => (
                      <UploadButtonContent
                        ready={ready}
                        isUploading={isUploading}
                        hasImage={!!cardData.image}
                      />
                    ),
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

ImageUploadButton.displayName = "ImageUploadButton";
