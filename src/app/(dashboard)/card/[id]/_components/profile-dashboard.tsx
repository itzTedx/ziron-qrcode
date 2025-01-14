"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { IconCamera, IconEdit } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Icons } from "@/components/assets/icons";
import { DeleteIcon } from "@/components/assets/trash-icon";
import {
  AlertDialog,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { deleteCard } from "@/server/actions/delete-card";
import { useShareModalStore } from "@/store/use-share-modal";
import { Person } from "@/types";
import { cardSchema } from "@/types/card-schema";

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

  const { setValue, control, setError } =
    useFormContext<z.infer<typeof cardSchema>>();

  const openModal = useShareModalStore((state) => state.openModal);

  const shareData = {
    url: shareLink,
    name: data.name,
    logo: data.company?.logo || undefined,
  };

  const { execute: deleteExistingCard } = useAction(deleteCard, {
    onSuccess: ({ data: existingCard }) => {
      if (existingCard?.success) {
        router.push("/");
        toast.success(existingCard.success);
      }
      if (existingCard?.error) toast.error(existingCard.error);
    },
  });

  return (
    <div className="-mt-20">
      <div className="group relative h-60 bg-secondary">
        <Image
          src={data.cover!}
          fill
          priority
          sizes="100vw"
          alt="cover image"
          title="Cover Image"
          className="object-cover transition-[filter] group-hover:brightness-90"
          quality={60}
        />
        <Dialog open={openCover} onOpenChange={setOpenCover}>
          <DialogTrigger asChild>
            <Button
              className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full"
              variant="outline"
            >
              <IconCamera className="size-5" /> Change Cover
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle>Update Cover Image</DialogTitle>
              <DialogDescription>
                Upload some best headshot of the person
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={control}
              name="image"
              render={({}) => (
                <FormItem>
                  <FormLabel>Change Cover Image</FormLabel>
                  <FormControl>
                    <UploadDropzone
                      endpoint="cover"
                      onUploadBegin={() => {
                        toast.loading("Uploading profile picture...");
                      }}
                      onUploadError={(error) => {
                        setError("cover", {
                          type: "validate",
                          message: error.message,
                        });
                      }}
                      onClientUploadComplete={(res) => {
                        setValue("cover", res[0].url);

                        toast.dismiss();
                        toast.success("Profile picture uploaded");
                        setOpenCover(false);
                      }}
                      config={{ mode: "auto" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="container relative -mt-16 grid max-w-6xl grid-cols-10 rounded-lg bg-background py-4 shadow-lg shadow-muted/30 md:divide-x">
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
            <Dialog open={openPhoto} onOpenChange={setOpenPhoto}>
              <DialogTrigger asChild>
                <Button
                  className="absolute bottom-1 right-1 z-10 flex items-center justify-center rounded-full"
                  variant="outline"
                  size="icon"
                >
                  <IconCamera className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="sr-only">
                  <DialogTitle>Update Profile Picture</DialogTitle>
                  <DialogDescription>
                    Upload some best headshot of the person
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={control}
                  name="image"
                  render={({}) => (
                    <FormItem>
                      <FormLabel>Change Profile Picture</FormLabel>
                      <FormControl>
                        <UploadDropzone
                          endpoint="photo"
                          onUploadBegin={() => {
                            toast.loading("Uploading profile picture...");
                          }}
                          onUploadError={(error) => {
                            setError("image", {
                              type: "validate",
                              message: error.message,
                            });
                          }}
                          onClientUploadComplete={(res) => {
                            setValue("image", res[0].url);

                            toast.dismiss();
                            toast.success("Profile picture uploaded");
                            setOpenPhoto(false);
                          }}
                          config={{ mode: "auto" }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full max-md:mt-3 md:ml-32">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary">{data.company?.name}</Badge>
              <span className="flex gap-3 text-primary md:hidden">
                <IconEdit />
                {/* <Share /> */}
              </span>
            </div>
            <h2 className="text-lg font-semibold lg:text-2xl">{data.name}</h2>
            <p className="text-sm">{data.designation}</p>
          </div>
        </div>

        <div className="col-span-10 flex items-center justify-between gap-4 md:col-span-4 md:px-3 lg:px-6">
          <div className="w-full space-y-2 max-md:hidden">
            <h3 className="max-md:text-xs">Link</h3>
            <div className="flex items-center justify-between gap-2">
              <Input
                readOnly
                className="w-full bg-gray-50"
                defaultValue={shareLink}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  openModal(shareData, data.name);
                }}
                variant="secondary"
                className="hidden items-center gap-1.5 text-white md:flex"
              >
                <Icons.share className="size-4 stroke-[1.5]" />
                <span>
                  Share <span className="max-md:hidden">url</span>
                </span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {/* <div className="hidden items-center gap-1.5 text-nowrap text-xs md:flex md:text-sm">
              Customize url <IconArrowRight className="size-3 md:size-4" />
            </div> */}
          </div>
        </div>

        <div className="col-span-2 hidden flex-col gap-3 px-6 md:flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:text-destructive"
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
                  onClick={() => {
                    if (data.id) {
                      deleteExistingCard({ id: data.id });
                    }
                  }}
                >
                  Yes, I&apos;m sure
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* <Button
            variant="outline"
            className="border-destructive text-destructive"
            onClick={(e) => {
              e.preventDefault();
              if (data.id) {
                deleteExistingCard({ id: data.id });
              }
            }}
          >
            Delete
          </Button> */}

          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
