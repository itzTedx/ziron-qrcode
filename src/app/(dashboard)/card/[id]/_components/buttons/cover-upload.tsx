import Image from "next/image";

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

export const CoverUpload = ({ cover, setLoading }: Props) => {
  const form = useFormContext<zCardSchema>();

  return (
    <FormField
      control={form.control}
      name="cover"
      render={({}) => (
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
                  alt=""
                  sizes="100vw"
                  className="-z-10 object-cover"
                />
              </div>
            ) : (
              <UploadDropzone
                endpoint="cover"
                onUploadBegin={() => {
                  setLoading(true);
                  toast.loading("Uploading cover image...");
                }}
                onUploadError={(error) => {
                  form.setError("cover", {
                    type: "validate",
                    message: error.message,
                  });
                }}
                onClientUploadComplete={(res) => {
                  setLoading(false);
                  form.setValue("cover", res[0].url);
                  toast.dismiss();
                  toast.success("Cover image uploaded");
                }}
                config={{ mode: "auto" }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
