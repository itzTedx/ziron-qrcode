"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCaretUpDownFilled,
  IconEdit,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { cardSchema } from "@/types/card-schema";

import ProfileDashboard from "./profile-dashboard";

interface CardCustomizedProps {
  data: {
    id: number;
    name: string;
    phone: string | null;
    website: string | null;
    address: string | null;
    logo: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
  isNew: boolean;
}

export default function CardCustomizeForm({
  data,
  isNew,
}: CardCustomizedProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: "",
    },
  });

  const { execute, status } = useAction(createCard, {
    onExecute: () => {
      setLoading(true);
    },
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push("/");

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

  function onSubmit(values: z.infer<typeof cardSchema>) {
    execute(values);
  }

  const photo = form.getValues("image");

  return (
    <main className="relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(!isNew && "mt-4")}
        >
          {!isNew && <ProfileDashboard />}
          <div className="container grid max-w-6xl gap-8 pt-3 md:grid-cols-10 md:pt-9">
            <Tabs
              defaultValue="information"
              className="col-span-6 w-full items-start"
            >
              <TabsList className="w-full">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
              </TabsList>

              <TabsContent
                value="information"
                className="grid grid-cols-2 gap-4"
              >
                {isNew && (
                  <div className="flex gap-3 pt-3">
                    <div className="relative grid size-20 place-items-center overflow-hidden rounded-full border bg-gray-100">
                      {photo ? (
                        <Image
                          src={photo}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <IconUser className="size-8 text-muted-foreground/60" />
                      )}
                    </div>
                    <UploadButton
                      endpoint="photo"
                      className="cursor-pointer transition-all duration-500 ease-in-out ut-button:h-9 ut-button:w-fit ut-button:border ut-button:bg-transparent ut-button:px-4 ut-button:text-foreground ut-allowed-content:hidden ut-button:ut-uploading:after:bg-secondary"
                      onUploadBegin={() => {
                        setLoading(true);
                        toast.loading("Uploading Image");
                      }}
                      onClientUploadComplete={(res) => {
                        setLoading(false);
                        form.setValue("image", res[0].url);
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
                            <div className="flex items-center gap-1.5 text-nowrap text-sm font-medium">
                              {photo ? (
                                <IconEdit className="size-4" />
                              ) : (
                                <IconUpload className="size-4" />
                              )}
                              {photo ? "Edit" : "Upload Photo"}
                            </div>
                          );
                        },
                      }}
                    />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@company.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+971 98 765 4321"
                          {...field}
                          type="number"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Company</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between border-input text-foreground",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? data.find((cat) => cat.id === field.value)
                                    ?.name
                                : "Select Category"}
                              <IconCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search Category..." />
                            <CommandEmpty>No Category found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {data.map((cat) => (
                                  <CommandItem
                                    value={cat.name}
                                    key={cat.id}
                                    onSelect={() => {
                                      form.setValue("companyId", cat.id);
                                    }}
                                  >
                                    {cat.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandSeparator />
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sales & Marketing"
                          {...field}
                          type="text"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Sales & Marketing" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormLabel>Cover image</FormLabel>
                  {form.getValues("cover")}
                  <UploadDropzone
                    endpoint="cover"
                    onUploadBegin={() => {
                      setLoading(true);
                      toast.loading("Uploading cover image...");
                    }}
                    onClientUploadComplete={(res) => {
                      setLoading(false);
                      form.setValue("cover", res[0].url);
                      toast.dismiss();
                      toast.success("Cover image uploaded");
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
            {/* <Button type="submit">Submit</Button> */}
            <div className="col-span-4 hidden rounded-lg bg-background md:block">
              Preview
            </div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
