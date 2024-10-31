"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { IconArrowRight, IconEdit, IconTrash } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Icons } from "@/components/assets/icons";
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
import { Input } from "@/components/ui/input";
import { deleteCard } from "@/server/actions/delete-card";
import { useShareModalStore } from "@/store/use-share-modal";
import { Person } from "@/types";

interface ProfileDashboardProps {
  data: Person;
  loading: boolean;
}

export default function ProfileDashboard({
  data,
  loading,
}: ProfileDashboardProps) {
  const router = useRouter();
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_PATH}/id/${data.slug}`;

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
      <div className="relative h-52 bg-secondary md:h-44">
        <Image
          src={data.cover!}
          fill
          priority
          sizes="100vw"
          alt="cover image"
          title="Cover Image"
          className="object-cover"
          quality={60}
        />
      </div>
      <div className="container relative -mt-16 grid max-w-6xl grid-cols-10 rounded-lg bg-background py-4 shadow-lg shadow-muted/30 md:divide-x">
        <div className="col-span-10 flex md:col-span-4 md:px-3 lg:px-6">
          <div className="absolute -top-[60%] left-5 size-28 translate-y-20 overflow-hidden rounded-full border-4 border-background md:size-36 md:translate-y-1/3">
            <Image
              src={data.image!}
              fill
              sizes="10vw"
              alt="Profile Image"
              quality={25}
              className="object-cover"
            />
          </div>
          <div className="w-full max-md:mt-9 md:ml-32">
            <div className="flex justify-between gap-3">
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
            <Button
              onClick={(e) => {
                e.preventDefault();
                openModal(shareData, data.name);
              }}
              variant="secondary"
              className="hidden items-center gap-1.5 md:flex"
            >
              <Icons.share className="size-4 stroke-[1.5]" />
              <span>
                Share <span className="max-md:hidden">url</span>
              </span>
            </Button>
          </div>
        </div>

        <div className="col-span-2 hidden flex-col gap-3 px-6 md:flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive"
              >
                <IconTrash className="mr-1 size-4" />
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
