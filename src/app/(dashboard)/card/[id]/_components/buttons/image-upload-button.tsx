"use client";

import Image from "next/image";

import { IconEdit, IconUpload, IconUser } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UploadButton } from "@/lib/uploadthing";
import { Person } from "@/types";
import { cardSchema } from "@/types/card-schema";

interface Props {
  isEditMode: boolean;
  cardData: Person;
  setLoading: (loading: boolean) => void;
}

export const ImageUploadButton = ({
  isEditMode,
  cardData,
  setLoading,
}: Props) => {
  const form = useFormContext<z.infer<typeof cardSchema>>();

  return (
    <FormField
      control={form.control}
      name="image"
      render={({}) => (
        <FormItem className="col-span-2">
          <FormControl>
            {!isEditMode && (
              <div className="flex gap-3 pt-3">
                <div className="relative grid size-20 flex-shrink-0 place-items-center overflow-hidden rounded-full border bg-gray-100">
                  {cardData.image ? (
                    <Image
                      src={cardData.image}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <IconUser className="size-8 text-muted-foreground/60" />
                  )}
                </div>
                <UploadButton
                  endpoint="photo"
                  className="cursor-pointer transition-all duration-500 ease-in-out ut-button:h-9 ut-button:w-fit ut-button:border ut-button:bg-transparent ut-button:px-4 ut-button:text-foreground ut-allowed-content:hidden ut-button:ut-uploading:after:bg-secondary"
                  onUploadError={(error) => {
                    form.setError("image", {
                      type: "validate",
                      message: error.message,
                    });
                  }}
                  onUploadBegin={() => {
                    setLoading(true);
                    toast.loading("Uploading photo");
                  }}
                  onClientUploadComplete={(res) => {
                    setLoading(false);
                    form.setValue("image", res[0].url);
                    toast.dismiss();
                    toast.success("Photo Uploaded");
                  }}
                  content={{
                    button({ ready, isUploading }) {
                      if (ready)
                        if (isUploading)
                          return <div className="text-sm">Uploading...</div>;
                      return (
                        <div className="flex items-center gap-1.5 text-nowrap text-sm font-medium">
                          {cardData.image ? (
                            <IconEdit className="size-4" />
                          ) : (
                            <IconUpload className="size-4" />
                          )}
                          {cardData.image ? "Edit" : "Upload Photo"}
                        </div>
                      );
                    },
                  }}
                />
              </div>
            )}
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
