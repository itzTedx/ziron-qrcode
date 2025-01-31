"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  IconArrowRight,
  IconArrowsMaximize,
  IconCaretUpDownFilled,
  IconEdit,
  IconExternalLink,
  IconGripVertical,
  IconPlus,
  IconTrash,
  IconUpload,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { Reorder } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Icons } from "@/components/assets/icons";
import CardTemplate from "@/components/features/templates/card-template";
import DefaultTemplate from "@/components/features/templates/default-template";
import ModernTemplate from "@/components/features/templates/modern-template";
import PhoneMockup from "@/components/phone-mockup";
import { ResponsiveModal } from "@/components/responsive-modal";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LINKS } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { useCompanyFormModal } from "@/store/use-company-form-modal";
import { usePreviewModalStore } from "@/store/use-preview-modal";
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
  const [active, setActive] = useState(0);

  const [tab, setTab] = useQueryState("tab");

  const dragRef = useRef<HTMLDivElement>(null);

  const openCompanyModal = useCompanyFormModal((state) => state.openModal);
  const { onOpenChange, isOpen } = usePreviewModalStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultTab = tab || "information";

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
        mapUrl: initialData.mapUrl || undefined,
        links: initialData.links
          ? initialData.links.map((link) => ({
              ...link,
              id: link.id?.toString(),
            }))
          : undefined,
      }
    : {
        emails: [{ email: "", label: "primary" }],
        phones: [{ phone: "", label: "primary" }],
        links: undefined,
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
  const debouncedValue = useDebounce(formValues, 1000);

  const { fields, append, remove, move } = useFieldArray({
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

  // console.log(debouncedValue.emails, debouncedValue.phones);

  function onSubmit(values: z.infer<typeof cardSchema>) {
    const validation = cardSchema.safeParse(values);
    console.log(validation);

    execute(values);
  }

  const name = form.getValues("name");
  const placeholderPhoto = name
    ? `https://ui-avatars.com/api/?background=random&name=${debouncedValue.name}&size=128`
    : null;
  const cover = form.getValues("cover");

  const cardData = useMemo(() => {
    const companyId = formValues.companyId;
    const companyData = data?.find((c) => c.id === companyId);

    return {
      ...formValues,
      id: companyId,

      name: formValues.name || "",
      image: formValues.image || placeholderPhoto,
      company: companyData,
      links: formValues.links?.map((link) => ({
        ...link,
        id: link.id ? parseInt(link.id.toString()) : undefined,
      })),
    } as Person;
  }, [formValues, data, placeholderPhoto]);

  const handleTabClick = (tab: string) => {
    setTab(tab);
  };

  return (
    <main className="relative pb-9 sm:pb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isEditMode && "mt-4", "relative")}
        >
          {isEditMode && initialData && (
            <ProfileDashboard data={cardData} loading={loading} />
          )}
          <div className="container grid max-w-7xl gap-8 py-3 pb-9 md:grid-cols-12 md:py-9">
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
                              {cardData.image ? (
                                <Image
                                  src={cardData.image}
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
                                      {cardData.image ? (
                                        <IconEdit className="size-4" />
                                      ) : (
                                        <IconUpload className="size-4" />
                                      )}
                                      {cardData.image ? "Edit" : "Upload Photo"}
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
                <div className="col-span-2 sm:col-span-1">
                  {emailFields.map((field, index) => (
                    <div className="flex w-full items-end" key={field.id}>
                      <FormField
                        control={form.control}
                        name={`emails.${index}.email`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="flex items-center justify-between">
                              <FormLabel
                                className={cn(index !== 0 && "sr-only")}
                              >
                                Email
                              </FormLabel>
                              <FormMessage />
                            </div>

                            <FormControl className="w-full">
                              <Input
                                type="email"
                                {...field}
                                placeholder="name@company.com"
                                className={cn(
                                  "w-full rounded-e-none border-r-0"
                                )}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`emails.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={"sr-only"}>
                              Email Label
                            </FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={cn(
                                    "w-24 shrink-0 rounded-none text-xs font-medium text-muted-foreground",
                                    emailFields.length === 1
                                      ? "rounded-e-lg border-r"
                                      : "border-r-0"
                                  )}
                                >
                                  <SelectValue placeholder="Label" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="work">Work</SelectItem>
                                <SelectItem value="personal">
                                  Personal
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
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
                          "shrink-0",
                          emailFields.length > 1
                            ? "flex rounded-s-none"
                            : "hidden"
                        )}
                      >
                        <IconX className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={() => {
                      if (cardData.emails) {
                        const lastEmailField =
                          cardData.emails[emailFields.length - 1];

                        console.log(lastEmailField);
                        if (lastEmailField && !lastEmailField.email) {
                          // Do not add a new phone field if the last one is empty
                          toast.error(
                            "Please add a email before adding another."
                          );
                          return;
                        }
                      }
                      appendEmail({ email: "", label: "primary" });
                    }}
                  >
                    <IconPlus className="mr-2 size-4" />
                    Add work or personal email
                  </Button>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  {/* {phoneFields.map((field, index) => (
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
                                className={cn("rounded-e-none border-r-0")}
                              />
                              <Select defaultValue="work">
                                <SelectTrigger
                                  tabIndex={-1}
                                  className={cn(
                                    "w-24 shrink-0 rounded-none text-xs font-medium text-muted-foreground",
                                    emailFields.length === 1
                                      ? "rounded-e-lg border-r"
                                      : "border-r-0"
                                  )}
                                >
                                  <SelectValue placeholder="Label" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="primary">
                                    Primary
                                  </SelectItem>
                                  <SelectItem value="work">Work</SelectItem>
                                  <SelectItem value="personal">
                                    Personal
                                  </SelectItem>
                                  <SelectItem value="home">Home</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="icon"
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  removePhone(index);
                                }}
                                className={cn(
                                  "shrink-0",
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
                  ))} */}

                  {phoneFields.map((field, index) => (
                    <div className="flex w-full items-end" key={field.id}>
                      <FormField
                        control={form.control}
                        name={`phones.${index}.phone`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="flex items-center justify-between">
                              <FormLabel
                                className={cn(index !== 0 && "sr-only")}
                              >
                                Phone
                              </FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl className="w-full">
                              <Input
                                type="tel"
                                {...field}
                                placeholder="+971 98 765 4321"
                                className={cn(
                                  "w-full rounded-e-none border-r-0"
                                )}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`phones.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={"sr-only"}>
                              Phone Label
                            </FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  tabIndex={-1}
                                  className={cn(
                                    "w-24 shrink-0 rounded-none text-xs font-medium text-muted-foreground",
                                    emailFields.length === 1
                                      ? "rounded-e-lg border-r"
                                      : "border-r-0"
                                  )}
                                >
                                  <SelectValue placeholder="Label" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="work">Work</SelectItem>
                                <SelectItem value="personal">
                                  Personal
                                </SelectItem>
                                <SelectItem value="home">Home</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
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
                          "shrink-0",
                          emailFields.length > 1
                            ? "flex rounded-s-none"
                            : "hidden"
                        )}
                      >
                        <IconX className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    tabIndex={-1}
                    onClick={() => {
                      if (cardData.phones) {
                        const lastPhoneField =
                          cardData.phones[phoneFields.length - 1];

                        console.log(lastPhoneField);
                        if (lastPhoneField && !lastPhoneField.phone) {
                          // Do not add a new phone field if the last one is empty
                          toast.error(
                            "Please add a email before adding another."
                          );
                          return;
                        }
                      }
                      appendPhone({ phone: "", label: "primary" });
                    }}
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
                  name="mapUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Google Map URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
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
                                ? data.find(
                                    (cat) => cat.id === field.value
                                  ) && (
                                    <span className="inline-flex gap-2.5">
                                      <Image
                                        src={
                                          data.find(
                                            (cat) => cat.id === field.value
                                          )?.logo ||
                                          "images/placeholder-cover.jpg"
                                        }
                                        height={16}
                                        width={16}
                                        alt=""
                                      />

                                      <span>
                                        {
                                          data.find(
                                            (cat) => cat.id === field.value
                                          )?.name
                                        }
                                      </span>
                                    </span>
                                  )
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
                                    className="cursor-pointer gap-2.5 px-4 py-2.5 font-medium"
                                    key={cat.id}
                                    onSelect={() => {
                                      form.setValue("companyId", cat.id!);
                                      setOpenPopover(false);
                                    }}
                                  >
                                    <Image
                                      src={
                                        cat.logo ||
                                        "images/placeholder-cover.jpg"
                                      }
                                      height={16}
                                      width={16}
                                      alt=""
                                    />
                                    <span>{cat.name}</span>
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
                <div className="flex flex-col gap-8 pt-3" ref={dragRef}>
                  <Reorder.Group
                    as="div"
                    className="w-full space-y-4"
                    values={fields}
                    onReorder={(e) => {
                      const activeEl = fields[active];
                      e.map((item, index) => {
                        if (item === activeEl) {
                          move(active, index);
                          setActive(index);
                          return;
                        }
                        return;
                      });
                    }}
                  >
                    {fields.map((data, index) =>
                      data.category === "General" ? (
                        <Reorder.Item
                          as="div"
                          id={data.id}
                          dragConstraints={dragRef}
                          onDragStart={() => setActive(index)}
                          value={data}
                          key={data.id}
                        >
                          <Card className="flex items-center justify-between gap-2 p-4">
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
                              className="text-destructive hover:text-destructive"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <IconTrash size={16} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Drag to Re-Order"
                              className="text-gray-400 hover:bg-transparent hover:text-foreground"
                              onClick={(e) => e.preventDefault()}
                            >
                              <IconGripVertical size={16} />
                            </Button>
                          </Card>
                        </Reorder.Item>
                      ) : (
                        <Reorder.Item
                          as="div"
                          id={data.id}
                          onDragStart={() => setActive(index)}
                          value={data}
                          dragConstraints={dragRef}
                          key={data.id}
                        >
                          <Card
                            key={data.id}
                            className="flex items-center justify-between gap-2 p-4"
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
                              className="text-destructive hover:text-destructive"
                              onClick={() => remove(index)}
                            >
                              <IconTrash size={16} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Drag to Re-Order"
                              className="text-gray-400 hover:bg-transparent hover:text-foreground"
                              onClick={(e) => e.preventDefault()}
                            >
                              <IconGripVertical size={16} />
                            </Button>
                          </Card>
                        </Reorder.Item>
                      )
                    )}
                  </Reorder.Group>
                </div>
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
                                form.getValues("attachmentFileName")!
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
                <ScrollArea className="relative flex w-[calc(100svw-1rem)] gap-8 overflow-x-clip px-3 sm:w-auto">
                  <ScrollBar orientation="horizontal" />

                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem className="space-y-3 pb-6">
                        <FormLabel>Select Theme</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-9"
                          >
                            <FormItem className="flex flex-col items-center space-y-3">
                              <PhoneMockup className="@container">
                                <ScrollArea className="h-full touch-none select-none">
                                  <DefaultTemplate
                                    card={cardData}
                                    company={data}
                                  />
                                </ScrollArea>
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
                              <PhoneMockup className="@container">
                                <ScrollArea className="h-full">
                                  <ModernTemplate
                                    card={cardData}
                                    company={data}
                                  />
                                </ScrollArea>
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
                            <FormItem className="flex flex-col items-center space-y-3">
                              <PhoneMockup className="@container">
                                <ScrollArea className="h-full">
                                  <CardTemplate
                                    card={cardData}
                                    company={data}
                                  />
                                </ScrollArea>
                              </PhoneMockup>
                              <div className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="card"
                                    id="card"
                                    aria-label="card template"
                                    className="size-5 border-primary shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="card"
                                >
                                  Card
                                </FormLabel>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ScrollArea>
                <section className="divide-y">
                  <h5 className="pb-3 text-sm font-medium">Customize Theme</h5>
                  <FormField
                    control={form.control}
                    name={"theme"}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
                        <FormLabel>Theme Color</FormLabel>
                        <FormControl>
                          <ColorsInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {cardData.template === "modern" ||
                  cardData.template === "card" ? (
                    <FormField
                      control={form.control}
                      name={"btnColor"}
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
                          <FormLabel>Button</FormLabel>
                          <FormControl>
                            <ColorsInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
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

            <Card className="sticky top-24 col-span-4 hidden h-fit rounded-lg bg-background @container md:block">
              <CardHeader className="flex-row items-center justify-between border-b py-4">
                <h5>Preview</h5>
                <ResponsiveModal
                  isOpen={isOpen}
                  closeModal={onOpenChange}
                  trigger={
                    <IconArrowsMaximize className="size-4 text-gray-600" />
                  }
                  title="Preview"
                  className="max-w-sm gap-0"
                >
                  <CardContent className="light relative p-0">
                    <ScrollArea className="h-[640px]">
                      {(() => {
                        switch (form.watch("template")) {
                          case "default":
                            return (
                              <DefaultTemplate card={cardData} company={data} />
                            );
                          case "modern":
                            return (
                              <ModernTemplate card={cardData} company={data} />
                            );
                          case "card":
                            return (
                              <CardTemplate card={cardData} company={data} />
                            );
                          default:
                            return (
                              <DefaultTemplate card={cardData} company={data} />
                            );
                        }
                      })()}
                    </ScrollArea>
                  </CardContent>
                </ResponsiveModal>

                {/* <IconDots /> */}
              </CardHeader>
              <CardContent className="relative py-5">
                <PhoneMockup>
                  <ScrollArea className="h-full">
                    {(() => {
                      switch (form.watch("template")) {
                        case "default":
                          return (
                            <DefaultTemplate card={cardData} company={data} />
                          );
                        case "modern":
                          return (
                            <ModernTemplate card={cardData} company={data} />
                          );
                        case "card":
                          return (
                            <CardTemplate card={cardData} company={data} />
                          );
                        default:
                          return (
                            <DefaultTemplate card={cardData} company={data} />
                          );
                      }
                    })()}
                  </ScrollArea>
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
