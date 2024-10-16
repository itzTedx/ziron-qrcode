"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowRight,
  IconCaretUpDownFilled,
  IconDots,
  IconEdit,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import AddLinkModal from "@/components/features/modals/add-link-modal";
import DefaultTemplate from "@/components/features/templates/default-template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { useCompanyFormModal } from "@/store/use-company-form-modal";
import { Company, Person } from "@/types";
import { cardSchema } from "@/types/card-schema";

import LinksDND from "./links-dnd";
import ProfileDashboard from "./profile-dashboard";

interface CardCustomizeProps {
  data: Company[];
  isEditMode: boolean;
  initialData?: Person;
}

export default function CardCustomizeForm({
  data,
  isEditMode,
  initialData,
}: CardCustomizeProps) {
  const [loading, setLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const openCompanyModal = useCompanyFormModal((state) => state.openModal);

  const searchParams = useSearchParams();
  const router = useRouter();

  const openModal = useAddLinkModal((state) => state.openModal);

  const defaultValues = initialData
    ? {
        ...initialData,
        links: initialData.links
          ? initialData.links.map((link) => ({
              ...link,
              id: link.id?.toString(),
            }))
          : undefined,
      }
    : {};

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues,
  });

  // Use useWatch to observe all form values for the preview
  const formValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    const companyIdParams = searchParams.get("company");
    if (companyIdParams) {
      form.setValue("companyId", parseInt(companyIdParams));
    }
  }, [searchParams, form]);

  const { execute } = useAction(createCard, {
    onExecute: () => {
      setLoading(true);
    },
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push(`/?default=${data.company}`);

        toast.success(data.success);
        setLoading(false);
      }
    },

    onError: () => {
      toast.error("Something went wrong.");
      setLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof cardSchema>) {
    execute(values);
  }

  const photo = form.getValues("image");
  const name = form.getValues("name");
  const placeholderPhoto = name
    ? `https://ui-avatars.com/api/?background=random&name=${name}&size=128`
    : null;
  const cover = form.getValues("cover");

  const cardData = useMemo(() => {
    const companyId = formValues.companyId;
    const companyData = data?.find((c) => c.id === companyId);

    return {
      ...formValues,
      id: companyId,
      name: formValues.name || "", // Ensure name is always a string
      image: formValues.image || placeholderPhoto,
      company: companyData,
      links: formValues.links?.map((link) => ({
        ...link,
        id: link.id ? parseInt(link.id) : undefined,
      })),
    } as Person; // Assert the type as Person
  }, [formValues, data, placeholderPhoto]);

  console.log(formValues);

  return (
    <main className="relative pb-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isEditMode && "mt-4")}
        >
          {isEditMode && initialData && (
            <ProfileDashboard data={initialData} loading={loading} />
          )}
          <div className="container grid max-w-6xl gap-8 pt-3 md:grid-cols-12 md:pt-9">
            <Tabs
              defaultValue="information"
              className="col-span-8 w-full items-start"
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
                  render={({}) => (
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
                          type="tel"
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

                      <Popover open={openPopover} onOpenChange={setOpenPopover}>
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
                              <CommandGroup heading="Companies">
                                {data.map((cat) => (
                                  <CommandItem
                                    value={cat.name}
                                    className="cursor-pointer px-4 py-2.5 font-medium"
                                    key={cat.id}
                                    onSelect={() => {
                                      form.setValue("companyId", cat.id!);
                                      setOpenPopover(false);
                                    }}
                                  >
                                    {cat.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandGroup heading="New Company?">
                                <CommandItem
                                  className="cursor-pointer px-4 py-2.5 font-medium"
                                  onSelect={() => {
                                    setOpenPopover(false);
                                    openCompanyModal();
                                  }}
                                >
                                  {/* <IconPlus className="mr-2 size-3" /> */}
                                  Add new
                                </CommandItem>
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
                        <Textarea
                          placeholder="Sales & Marketing"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isEditMode && (
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
                )}
              </TabsContent>
              <TabsContent value="links" className="flex flex-col gap-8">
                <div className="w-full space-y-4">
                  <LinksDND />
                  {/* <FormField
                    control={form.control}
                    name={`links`}
                    render={({}) => (
                      <FormItem>
                        <FormLabel className="text-base font-normal">
                          Links
                        </FormLabel>

                        <FormControl>
                          
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
                <AddLinkModal />
                <section>
                  <div className="flex items-center justify-between">
                    <h3>Suggestions</h3>
                    <Button variant="link" onClick={() => openModal()}>
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(6.2rem,1fr))] gap-3"></div>
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

            <Card className="sticky top-24 col-span-4 hidden h-fit rounded-lg bg-background md:block">
              <CardHeader className="flex-row items-center justify-between border-b py-4">
                <h5>Preview</h5>
                <IconDots />
              </CardHeader>
              <CardContent className="relative py-5">
                <div className="relative mx-auto h-full w-[290px] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-xl">
                  <div className="absolute left-1/2 top-1.5 z-40 flex h-[1.5rem] w-[80px] -translate-x-1/2 items-center justify-end rounded-full bg-gray-900 px-2">
                    <div className="size-3 rounded-full border-2 border-gray-600 bg-gray-900"></div>
                  </div>
                  <div className="absolute -start-[13px] top-[124px] z-40 h-[46px] w-[3px] rounded-s-lg bg-gray-900"></div>
                  <div className="absolute -start-[13px] top-[178px] z-40 h-[46px] w-[3px] rounded-s-lg bg-gray-900"></div>
                  <div className="absolute -end-[13px] top-[142px] z-40 h-[64px] w-[3px] rounded-e-lg bg-gray-900"></div>
                  <div className="h-[572px] w-[272px] overflow-hidden rounded-[2rem] bg-white @container">
                    <DefaultTemplate card={cardData} company={data} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
