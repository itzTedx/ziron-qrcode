"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowRight,
  IconCaretUpDownFilled,
  IconEdit,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useFieldArray, useForm } from "react-hook-form";
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
import { LINKS } from "@/constants";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { CardCustomizeProps } from "@/types/card-customize-props";
import { cardSchema } from "@/types/card-schema";

import LinksDND from "./links-dnd-test";
import ProfileDashboard from "./profile-dashboard";

export default function CardCustomizeForm({
  data,
  isEditMode,
  initialData,
}: CardCustomizeProps) {
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultValues = initialData ? { ...initialData } : {};

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues,
  });

  const companyIdParams = searchParams.get("company");
  if (companyIdParams) {
    form.setValue("companyId", parseInt(companyIdParams));
  }

  const { fields, append } = useFieldArray({
    name: "links",
    control: form.control,
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
  const cover = form.getValues("cover");

  return (
    <main className="relative pb-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isEditMode && "mt-4")}
        >
          {isEditMode && initialData && <ProfileDashboard data={initialData} />}
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
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        {!isEditMode && (
                          <div className="flex gap-3 pt-3">
                            <div className="relative grid size-20 flex-shrink-0 place-items-center overflow-hidden rounded-full border bg-gray-100">
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
                              onUploadError={(error) => {
                                form.setError("image", {
                                  type: "validate",
                                  message: error.message,
                                });
                              }}
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
                                        <div className="text-sm">
                                          Uploading...
                                        </div>
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
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <PopoverContent
                          align="start"
                          className="p-0 sm:w-[19.5rem]"
                        >
                          <Command>
                            <CommandInput placeholder="Search Category..." />
                            <CommandEmpty>Company not found</CommandEmpty>
                            <CommandList className="p-1">
                              <CommandGroup>
                                {data.map((cat) => (
                                  <CommandItem
                                    value={cat.name}
                                    className="cursor-pointer px-4 py-2.5 font-medium"
                                    key={cat.id}
                                    onSelect={() => {
                                      form.setValue("companyId", cat.id!);
                                    }}
                                  >
                                    {cat.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
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
                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="cover"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Cover image</FormLabel>
                        <FormControl>
                          {cover ? (
                            <div className="group relative mt-2 flex h-52 w-full items-center justify-center overflow-hidden rounded-md border transition duration-300 hover:brightness-90">
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
                )}
              </TabsContent>
              <TabsContent value="links" className="flex flex-col gap-8">
                <div className="w-full space-y-4">
                  {/* {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`links.${index}.href`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-normal">
                            Links
                          </FormLabel>

                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))} */}

                  <FormField
                    control={form.control}
                    name={`links`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-normal">
                          Links
                        </FormLabel>

                        <FormControl>
                          <LinksDND />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-12 w-full gap-1.5"
                    onClick={() => append({ value: "" })}
                  >
                    <IconPlus className="size-4" />
                    Add Link
                  </Button> */}
                </div>
                <section>
                  <div className="flex items-center justify-between">
                    <h3>Suggestions</h3>
                    <Button variant="link">View All</Button>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(6.2rem,1fr))] gap-3">
                    {LINKS.map((link, i) => (
                      <div
                        className="flex flex-col items-center rounded-md border bg-background p-3"
                        key={i}
                      >
                        <link.icon className="size-12 stroke-1" />
                        <p className="text-xs font-medium">{link.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <FormField
                  control={form.control}
                  name="cover"
                  render={() => (
                    <FormItem className="col-span-2">
                      <FormLabel className="flex items-center justify-between text-base font-normal">
                        Attachments
                        <Link
                          target="_blank"
                          href="https://www.ilovepdf.com/compress_pdf"
                          className="flex items-center gap-1 px-2 text-xs font-medium text-primary hover:underline"
                        >
                          Pdf Compressor
                          <IconArrowRight className="size-3" />
                        </Link>
                      </FormLabel>
                      <FormControl>
                        <UploadDropzone
                          endpoint="attachments"
                          onUploadBegin={() => {
                            setLoading(true);
                            toast.loading("Uploading attachment file...");
                          }}
                          onUploadError={(error) => {
                            form.setError("attachments", {
                              type: "validate",
                              message: error.message,
                            });
                          }}
                          onClientUploadComplete={(res) => {
                            setLoading(false);
                            form.setValue("attachments", res[0].url);
                            toast.dismiss();
                            toast.success("Attachment uploaded");
                          }}
                          config={{ mode: "auto" }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="col-span-4 hidden h-fit rounded-lg bg-background md:block">
              Preview
            </div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
