"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";

import {
  IconArrowsMaximize,
  IconCamera,
  IconPhoto,
  IconShare,
} from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import {
  Control,
  UseFormSetError,
  UseFormSetValue,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@/components/assets/icons";
import { DeleteIcon } from "@/components/assets/trash-icon";
import CopyButton from "@/components/copy-button";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadDropzone } from "@/lib/uploadthing";
import { deleteCard } from "@/server/actions/delete-card";
import { usePreviewModalStore } from "@/store/use-preview-modal";
import { useShareModalStore } from "@/store/use-share-modal";
import { Person } from "@/types";
import { zCardSchema } from "@/types/card-schema";

// Dynamically import heavy components
const ResponsiveModal = dynamic(
  () =>
    import("@/components/responsive-modal").then((mod) => mod.ResponsiveModal),
  {
    ssr: false,
  }
);

const AlertDialog = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialog)
);

// Memoize static sub-components
interface ImageUploadFieldProps {
  control: Control<zCardSchema>;
  setError: UseFormSetError<zCardSchema>;
  setValue: UseFormSetValue<zCardSchema>;
  onSuccess: () => void;
  endpoint: "photo" | "cover";
}

const ImageUploadField = memo(
  ({
    control,
    setError,
    setValue,
    onSuccess,
    endpoint,
  }: ImageUploadFieldProps) => (
    <FormField
      control={control}
      name="image"
      render={() => (
        <FormItem className="p-6">
          <FormLabel>
            Change {endpoint === "photo" ? "Profile Picture" : "Cover Image"}
          </FormLabel>
          <FormControl>
            <UploadDropzone
              endpoint={endpoint}
              onUploadBegin={() => toast.loading("Uploading...")}
              onUploadError={(error) => {
                setError(endpoint === "photo" ? "image" : "cover", {
                  type: "validate",
                  message: error.message,
                });
              }}
              onClientUploadComplete={(res) => {
                setValue(endpoint === "photo" ? "image" : "cover", res[0].url);
                toast.dismiss();
                toast.success("Upload complete");
                onSuccess();
              }}
              config={{ mode: "auto" }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
);
ImageUploadField.displayName = "ImageUploadField";

interface ProfileDashboardProps {
  data: Person;
  loading: boolean;
}

export default function ProfileDashboard({
  data,
  loading,
}: ProfileDashboardProps) {
  const [openPhoto, setOpenPhoto] = useState(false);
  const [openCover, setOpenCover] = useState(false);
  const router = useRouter();
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_PATH}/${data.slug}`;

  const { setValue, control, setError } = useFormContext<zCardSchema>();

  const openModal = useShareModalStore((state) => state.openModal);
  const openPreview = usePreviewModalStore((state) => state.onOpenChange);

  // Memoize handlers
  const handleShare = useCallback(() => {
    const shareData = {
      url: shareLink,
      name: data.name,
      logo: data.company?.logo || undefined,
    };
    openModal(shareData, data.name);
  }, [shareLink, data.name, data.company?.logo, openModal]);

  const { execute: deleteExistingCard } = useAction(deleteCard, {
    onSuccess: ({ data: existingCard }) => {
      if (existingCard?.success) {
        router.push("/");
        toast.success(existingCard.success);
      }
      if (existingCard?.error) toast.error(existingCard.error);
    },
  });

  const handleDelete = useCallback(() => {
    if (data.id) {
      deleteExistingCard({ id: data.id });
    }
  }, [data.id, deleteExistingCard]);

  return (
    <div className="-mt-20">
      <div className="group relative h-72 bg-secondary">
        <Image
          src={data.cover!}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          alt="cover image"
          title="Cover Image"
          className="object-cover transition-[filter] group-hover:brightness-90"
          quality={60}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,...`} // Add appropriate blur placeholder
        />

        <ResponsiveModal
          isOpen={openCover}
          asChild
          closeModal={setOpenCover}
          title="Update Cover Image"
          trigger={
            <Button
              className="absolute right-3 top-20 z-10 flex size-12 items-center justify-center gap-2 rounded-full bg-background/70 backdrop-blur-md sm:left-1/2 sm:top-1/2 sm:size-auto sm:w-fit sm:-translate-x-1/2 sm:-translate-y-1/2"
              variant="outline"
            >
              <IconPhoto className="size-5 shrink-0" />
              <span className="hidden sm:block"> Change Cover</span>
            </Button>
          }
        >
          <ImageUploadField
            control={control}
            setError={setError}
            setValue={setValue}
            onSuccess={() => setOpenCover(false)}
            endpoint="cover"
          />
        </ResponsiveModal>
      </div>
      <div className="container relative -mt-16 grid max-w-7xl grid-cols-10 rounded-lg border-t border-background bg-background/80 py-4 shadow-muted/30 backdrop-blur-xl sm:border sm:shadow-lg md:divide-x">
        <div className="col-span-10 flex md:col-span-4 md:px-3 lg:px-6">
          <div className="group absolute left-1/2 size-28 -translate-y-20 max-md:-translate-x-1/2 md:-top-[60%] md:left-5 md:size-36 md:translate-y-1/3">
            <Image
              src={data.image!}
              fill
              sizes="10vw"
              alt="Profile Image"
              quality={25}
              className="overflow-clip rounded-full border-4 border-background object-cover transition-[filter] group-hover:brightness-90"
            />
            <ResponsiveModal
              isOpen={openPhoto}
              closeModal={setOpenPhoto}
              asChild
              title="Update Profile Picture"
              trigger={
                <Button
                  className="absolute bottom-1 right-1 z-10 flex items-center justify-center rounded-full"
                  variant="outline"
                  size="icon"
                >
                  <IconCamera className="size-5" />
                </Button>
              }
            >
              <ImageUploadField
                control={control}
                setError={setError}
                setValue={setValue}
                onSuccess={() => setOpenPhoto(false)}
                endpoint="photo"
              />
            </ResponsiveModal>
          </div>
          <div className="w-full max-md:mt-3 md:ml-32">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary" className="gap-1.5">
                {data.company && data.company.logo && (
                  <Image src={data.company.logo} height={8} width={8} alt="" />
                )}
                {data.company?.name}
              </Badge>
              <span className="flex gap-2 text-primary md:hidden">
                <Button
                  type="button"
                  onClick={() => {
                    openPreview();
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <IconArrowsMaximize className="size-5" />
                </Button>
                <Button
                  type="button"
                  onClick={handleShare}
                  variant="ghost"
                  size="icon"
                >
                  <IconShare className="size-5" />
                </Button>
              </span>
            </div>
            <h2 className="-mt-1 text-lg font-semibold lg:text-2xl">
              {data.name}
            </h2>
            <p className="text-sm">{data.designation}</p>
          </div>
        </div>

        <div className="col-span-10 flex items-center justify-between gap-4 md:col-span-4 md:px-3 lg:px-6">
          <div className="w-full space-y-2 max-md:hidden">
            <h3 className="max-md:text-xs">Link</h3>
            <div className="inline-flex items-center gap-2">
              <CopyButton link={shareLink} />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleShare();
                }}
                variant="outline"
                className="hidden items-center gap-1.5 md:flex"
              >
                <Icons.share className="size-4 stroke-[1.5]" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-2 hidden flex-col gap-3 px-6 md:flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive bg-destructive/50 text-foreground hover:bg-destructive/40"
              >
                <DeleteIcon className="size-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  card.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={handleDelete}
                >
                  Yes, I&apos;m sure
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
