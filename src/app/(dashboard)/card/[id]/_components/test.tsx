"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  IconArrowRight,
  IconCaretUpDownFilled,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconPlus,
  IconTrash,
  IconUpload,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Icons } from "@/components/assets/icons";
import DefaultTemplate from "@/components/features/templates/default-template";
import ModernTemplate from "@/components/features/templates/modern-template";
import PhoneMockup from "@/components/phone-mockup";
import ColorsInput from "@/components/test/colors-input";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LINKS } from "@/constants";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { useCompanyFormModal } from "@/store/use-company-form-modal";
import { Company, Person } from "@/types";
import { cardSchema } from "@/types/card-schema";
import { removeExtension } from "@/utils/remove-extension";

import ProfileDashboard from "./profile-dashboard";

interface CardCustomizeProps {
  data: Company[];
  isEditMode: boolean;
  initialData?: Person;
  id: string;
}

export default function CardCustomizeForm({
  data,
  isEditMode,
  initialData,
  id,
}: CardCustomizeProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const openCompanyModal = useCompanyFormModal((state) => state.openModal);

  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultTab = searchParams.get("tab") || "information";

  const defaultValues = initialData
    ? {
        ...initialData,
        id: parseInt(id),
        phones: initialData.phones
          ? initialData.phones.map((phone) => ({
              ...phone,
              id: phone.id.toString(),
              phone: phone.phone?.toString(),
            }))
          : undefined,
        emails: initialData.emails
          ? initialData.emails.map((email) => ({
              ...email,
              id: email.id.toString(),
            }))
          : undefined,
        bio: initialData.bio || undefined,
        links: initialData.links
          ? initialData.links.map((link) => ({
              ...link,
              id: link.id?.toString(),
            }))
          : undefined,
      }
    : {
        emails: [{ email: "" }],
        phones: [{ phone: "" }],
        template: "default",
      };

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    defaultValues,
    mode: "onBlur",
  });

  // Use useWatch to observe all form values for the preview
  const formValues = useWatch({
    control: form.control,
  });

  const { fields, append, remove } = useFieldArray({
    name: "links",
    control: form.control,
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    name: "emails",
    control: form.control,
  });
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    name: "phones",
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
      toast.loading("Loading");
      setLoading(true);
    },
    onSuccess: ({ data }) => {
      console.log("On success data", data);
      if (data?.success) {
        router.push(`/?default=${data.company}`);

        toast.dismiss();
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
    // const validation = cardSchema.safeParse(values);

    // console.log("validate", validation);

    execute(values);
  }

  const photo = formValues.image;

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

  const handleTabClick = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tab);
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <main className="relative pb-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isEditMode && "mt-4", "relative")}
        >
          {isEditMode && initialData && (
            <ProfileDashboard data={cardData} loading={loading} />
          )}
          <div className="container grid max-w-6xl gap-8 py-3 pb-9 md:grid-cols-12 md:py-9">
            <Tabs
              defaultValue={defaultTab}
              className="col-span-8 w-full items-start"
            >
              <TabsList className="w-full">
                <TabsTrigger
                  value="information"
                  onClick={() => handleTabClick("information")}
                >
                  Information
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  onClick={() => handleTabClick("links")}
                >
                  Links
                </TabsTrigger>
                <TabsTrigger
                  value="template"
                  onClick={() => handleTabClick("template")}
                >
                  Template
                </TabsTrigger>
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
                <div className="">
                  {emailFields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`emails.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            Email
                          </FormLabel>

                          <FormControl>
                            <div className="flex">
                              <Input
                                type="email"
                                {...field}
                                placeholder="name@company.com"
                                className={cn(
                                  emailFields.length > 1
                                    ? "rounded-e-none border-r-0"
                                    : "rounded-md"
                                )}
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeEmail(index);
                                }}
                                className={cn(
                                  emailFields.length > 1
                                    ? "flex rounded-s-none"
                                    : "hidden"
                                )}
                              >
                                <IconX className="size-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={() => appendEmail({ email: "" })}
                  >
                    <IconPlus className="mr-2 size-4" />
                    Add work or personal email
                  </Button>
                </div>
                <div className="">
                  {phoneFields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`phones.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            Phone
                          </FormLabel>

                          <FormControl>
                            <div className="flex">
                              <Input
                                type="tel"
                                {...field}
                                placeholder="+971 98 765 4321"
                                className={cn(
                                  phoneFields.length > 1
                                    ? "rounded-e-none border-r-0"
                                    : "rounded-md"
                                )}
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removePhone(index);
                                }}
                                className={cn(
                                  phoneFields.length > 1
                                    ? "flex rounded-s-none"
                                    : "hidden"
                                )}
                              >
                                <IconX className="size-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={() => appendPhone({ phone: "" })}
                  >
                    <IconPlus className="mr-2 size-4" />
                    Add another number
                  </Button>
                </div>

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
                          placeholder="More about the person"
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
                  {/* <SocialLinks />*/}
                  {fields.map((data, index) =>
                    data.category === "General" ? (
                      <Card
                        key={data.id}
                        className="flex items-center justify-between gap-6 p-4"
                      >
                        <div className="grid grid-cols-5 items-center gap-4">
                          <FormField
                            control={form.control}
                            name={`links.${index}.label`}
                            render={({ field }) => (
                              <FormItem className="col-span-2 flex gap-3 space-y-0">
                                <Image
                                  src={data.icon}
                                  height={40}
                                  width={40}
                                  alt=""
                                  className="flex-shrink-0"
                                />
                                <FormControl>
                                  <Input
                                    className="space-y-0"
                                    {...field}
                                    disabled={loading}
                                    placeholder={`${data.label} Title`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            key={data.id}
                            name={`links.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="col-span-3">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={loading}
                                    placeholder={`${data.label} Url`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </Card>
                    ) : (
                      <Card
                        key={data.id}
                        className="flex items-center justify-between gap-6 p-4"
                      >
                        <div className="flex flex-1 gap-3">
                          <Image
                            src={data.icon}
                            height={40}
                            width={40}
                            alt=""
                          />
                          <FormField
                            control={form.control}
                            key={data.id}
                            name={`links.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={loading}
                                    placeholder={`${data.label} url`}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </Card>
                    )
                  )}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 w-full"
                      >
                        <IconPlus size={16} className="mr-2" /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl p-0">
                      <DialogHeader className="border-b p-6">
                        <DialogTitle>Add Link</DialogTitle>
                        <DialogDescription className="sr-only">
                          Add Social or custom links to digital card
                        </DialogDescription>
                      </DialogHeader>
                      <div className="p-6 pb-6 pt-0">
                        {LINKS.map((item, i) => (
                          <div key={i} className="py-3">
                            <h4 className="pb-2 text-sm font-medium text-gray-700">
                              {item.label}
                            </h4>

                            <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-6">
                              {item.links.map((link, i) => (
                                <div
                                  className="flex items-center justify-between border-b py-3"
                                  key={`addLink-${i}-${link.label}`}
                                >
                                  <div className="flex items-center gap-4 font-medium">
                                    <div className="relative size-8">
                                      <Image
                                        src={link.icon}
                                        fill
                                        alt=""
                                        sizes="10vw"
                                      />
                                    </div>

                                    <p>{link.label}</p>
                                  </div>
                                  <DialogClose asChild>
                                    <Button
                                      variant="ghost"
                                      onClick={() =>
                                        append({
                                          category: item.label,
                                          label: link.label,
                                          url: link.url,
                                          icon: link.icon,
                                        })
                                      }
                                      className="h-8 gap-2 px-2 font-semibold text-primary hover:text-blue-800"
                                    >
                                      <IconPlus className="size-3 stroke-[2.5]" />
                                      Add
                                    </Button>
                                  </DialogClose>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <section>
                  <div className="flex items-center justify-between">
                    <h3>Suggestions</h3>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
                    {LINKS.map((item) =>
                      item.links.slice(0, 4).map((link) => (
                        <Card
                          key={link.id}
                          onClick={() =>
                            append({
                              category: item.label,
                              label: link.label,
                              url: link.url,
                              icon: link.icon,
                            })
                          }
                          className="flex flex-col items-center justify-between p-6 transition-colors hover:border-primary hover:bg-muted/20"
                          role="button"
                        >
                          <Image
                            src={link.icon}
                            height={40}
                            width={40}
                            alt=""
                          />
                          <p className="mt-1 whitespace-nowrap text-sm font-medium">
                            {link.label}
                          </p>
                        </Card>
                      ))
                    )}
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
                            form.setError("attachmentUrl", {
                              type: "validate",
                              message: error.message,
                            });
                          }}
                          onClientUploadComplete={(res) => {
                            setLoading(false);
                            form.setValue("attachmentUrl", res[0].url);
                            form.setValue("attachmentFileName", res[0].name);
                            toast.dismiss();
                            toast.success("Attachment uploaded");
                          }}
                          config={{ mode: "auto" }}
                        />
                      </FormControl>
                      <FormMessage />
                      {formValues.attachmentFileName &&
                      formValues.attachmentUrl ? (
                        <Card className="flex justify-between gap-3 p-3">
                          <Link
                            href={formValues.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                          >
                            <Icons.pdf className="h-6" />
                            <p className="line-clamp-1 text-sm font-medium">
                              {removeExtension(
                                form.getValues("attachmentFileName")
                              )}
                            </p>{" "}
                            <IconExternalLink className="size-4 stroke-1 text-muted-foreground" />
                          </Link>

                          <Button
                            variant={"outline"}
                            size="icon"
                            className="hover:bg-red-600 hover:text-red-100"
                            onClick={(e) => {
                              e.preventDefault();
                              form.setValue("attachmentFileName", undefined);
                              form.setValue("attachmentUrl", undefined);
                            }}
                          >
                            <IconX className="size-5" />
                          </Button>
                        </Card>
                      ) : null}
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent
                value="template"
                className="flex flex-col gap-4 overflow-hidden"
              >
                <section className="flex gap-8 overflow-x-auto px-3 pb-9">
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel> Select Theme</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-9"
                          >
                            <FormItem className="flex flex-col items-center space-y-3">
                              <PhoneMockup className="">
                                <DefaultTemplate
                                  card={cardData}
                                  company={data}
                                />
                              </PhoneMockup>
                              <div className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="default"
                                    id="default"
                                    aria-label="Default Template"
                                    className="size-5 border-primary shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="default"
                                >
                                  Default
                                </FormLabel>
                              </div>
                            </FormItem>
                            <FormItem className="flex flex-col items-center space-y-3">
                              <PhoneMockup className="">
                                <ModernTemplate
                                  card={cardData}
                                  company={data}
                                />
                              </PhoneMockup>
                              <div className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="modern"
                                    id="modern"
                                    aria-label="Modern template"
                                    className="size-5 border-primary shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="modern"
                                >
                                  Modern
                                </FormLabel>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
                <section>
                  <h5>Customize Theme</h5>
                  <div className="flex gap-3">
                    <h6>Button Color</h6>
                    <ColorsInput />
                  </div>
                </section>
              </TabsContent>
              {!isEditMode && (
                <Button
                  type="submit"
                  className="mt-4 hidden h-12 w-full md:flex"
                  disabled={form.formState.isSubmitting || loading}
                >
                  Create Card
                </Button>
              )}
            </Tabs>

            <Card className="sticky top-24 col-span-4 hidden h-fit rounded-lg bg-background md:block">
              <CardHeader className="flex-row items-center justify-between border-b py-4">
                <h5>Preview</h5>
                <IconDots />
              </CardHeader>
              <CardContent className="relative py-5">
                <PhoneMockup>
                  <DefaultTemplate card={cardData} company={data} />
                </PhoneMockup>
              </CardContent>
            </Card>
          </div>
          <div className="fixed bottom-0 w-full bg-background/50 px-6 py-4 backdrop-blur-md md:hidden">
            {isEditMode ? (
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || loading}
                >
                  Save Changes
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-shrink-0"
                  size="icon"
                  disabled={form.formState.isSubmitting || loading}
                >
                  <IconTrash className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || loading}
              >
                Create Card
              </Button>
            )}
          </div>
        </form>
      </Form>
    </main>
  );
}