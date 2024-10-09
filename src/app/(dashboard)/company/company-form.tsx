"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconBuilding, IconLoader, IconPlus } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing";
import { createCompany } from "@/server/actions/create-company";
import { companySchema } from "@/types/company-schema";

export default function CompanyForm() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      phone: "+971 ",
      website: "",
      address: "",
      logo: "",
    },
  });

  const { execute, status } = useAction(createCompany, {
    onExecute: () => {
      setLoading(true);
    },
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.refresh();

        toast.success(data.success);
        setLoading(false);
      }
    },

    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong.");
      setLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof companySchema>) {
    execute(values);
  }

  const logo = form.getValues("logo");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pt-3">
        <div className="flex gap-6 pb-6">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="mt-2 flex flex-col items-center gap-2">
                    <div className="grid size-28 place-items-center rounded-md border bg-gray-50">
                      {uploading && (
                        <IconLoader className="absolute animate-spin text-muted-foreground/50" />
                      )}
                      {!uploading && logo ? (
                        <Image
                          src={logo}
                          height={70}
                          width={70}
                          alt="Company Logo"
                        />
                      ) : (
                        <IconBuilding className="size-20 text-muted" />
                      )}
                    </div>
                    <UploadButton
                      endpoint="profilePicture"
                      className="ut-allowed-content:text-secondary-foreground/70 ut-label:text-primary ut-button:w-fit ut-button:px-4 ut-button:h-9 ut-button:bg-primary ut-button:ut-uploading:after:bg-secondary ut-allowed-content:text-xs cursor-pointer transition-all duration-500 ease-in-out hover:bg-primary/5"
                      onUploadBegin={() => {
                        setLoading(true);
                        toast.loading("Uploading Image");
                      }}
                      onClientUploadComplete={(res) => {
                        setLoading(false);
                        form.setValue("logo", res[0].url);
                        toast.dismiss();
                        toast.success("Logo Uploaded");
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (ready)
                            if (isUploading)
                              return (
                                <div className="text-sm">Uploading...</div>
                              );
                          return (
                            <div className="text-nowrap text-sm">
                              Upload Logo
                            </div>
                          );
                        },
                        allowedContent({ ready, fileTypes, isUploading }) {
                          if (!ready) return "";
                          if (isUploading) return "";
                          return `Formats: png, svg`;
                        },
                      }}
                    />

                    {/* <Button variant="ghost" size="sm">
                      Upload Logo
                    </Button> */}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      autoFocus
                      {...field}
                      className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+971 98 765 4321" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="www.website.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full address"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-destructive font-medium text-destructive"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={status === "executing"}
            className="flex items-center gap-1.5 font-medium"
          >
            <IconPlus className="size-4" /> Add Company
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
