import Image from "next/image";
import { memo, useCallback } from "react";

import { IconEdit } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadDropzone } from "@/lib/uploadthing";
import { zCardSchema } from "@/types/card-schema";

interface Props {
  cover?: string;
  setLoading: (loading: boolean) => void;
}

export const CoverUpload = memo(({ cover, setLoading }: Props) => {
  const form = useFormContext<zCardSchema>();

  const handleUploadBegin = useCallback(() => {
    setLoading(true);
    toast.loading("Uploading cover image...");
  }, [setLoading]);

  const handleUploadError = useCallback(
    (error: Error) => {
      setLoading(false);
      toast.dismiss();
      form.setError("cover", {
        type: "validate",
        message: error.message,
      });
    },
    [form, setLoading]
  );

  const handleUploadComplete = useCallback(
    (res: { url: string }[]) => {
      setLoading(false);
      form.setValue("cover", res[0].url);
      toast.dismiss();
      toast.success("Cover image uploaded");
    },
    [form, setLoading]
  );

  return (
    <FormField
      control={form.control}
      name="cover"
      render={() => (
        <FormItem className="col-span-2">
          <FormLabel>Cover image</FormLabel>
          <FormControl>
            {cover ? (
              <div className="group relative mt-2 flex h-60 w-full items-center justify-center overflow-hidden rounded-md border transition duration-300 hover:brightness-90">
                <Button
                  className="gap-2 opacity-0 shadow-xl backdrop-blur-lg transition-opacity duration-300 group-hover:opacity-100"
                  type="button"
                >
                  <IconEdit /> Change
                </Button>
                <Image
                  src={cover}
                  fill
                  alt="Cover image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="-z-10 object-cover"
                  priority={false}
                  loading="lazy"
                />
              </div>
            ) : (
              <UploadDropzone
                endpoint="cover"
                onUploadBegin={handleUploadBegin}
                onUploadError={handleUploadError}
                onClientUploadComplete={handleUploadComplete}
                config={{ mode: "auto" }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

CoverUpload.displayName = "CoverUpload";
