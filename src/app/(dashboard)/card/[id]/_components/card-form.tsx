"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ColorsInput from "@/components/test/colors-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { usePreviewModalStore } from "@/store/use-preview-modal";
import { Company, Person } from "@/types";
import { cardSchema } from "@/types/card-schema";

import { ActionButtons } from "./buttons/action-buttons";
import { AttachmentUpload } from "./buttons/attachment-upload";
import { CoverUpload } from "./buttons/cover-upload";
import { ImageUploadButton } from "./buttons/image-upload-button";
import { DndLinks } from "./dnd-links";
import { CompanyField } from "./fields/company-field";
import { EmailsField } from "./fields/emails-field";
import { PhonesField } from "./fields/phones-field";
import { Preview } from "./preview";
import ProfileDashboard from "./profile-dashboard";
import { TabsComp } from "./tabs";
import { ThemeSelector } from "./theme-selector";

interface CardCustomizeProps {
  data: Company[];
  isEditMode: boolean;
  initialData?: Person;
  id: string;
}

const transformInitialData = (data: Person | undefined, id: string) => {
  if (!data) {
    return {
      emails: [{ email: "", label: "primary" }],
      phones: [{ phone: "", label: "primary" }],
      links: undefined,
      template: "default",
    };
  }

  return {
    ...data,
    id: parseInt(id),
    phones: data.phones?.map((phone) => ({
      ...phone,
      id: phone.id.toString(),
      phone: phone.phone?.toString(),
    })),
    emails: data.emails?.map((email) => ({
      id: email.id.toString(),
      email: email.email || undefined,
      label: email.category || "primary",
    })),
    bio: data.bio ?? undefined,
    mapUrl: data.mapUrl ?? undefined,
    template: data.template ?? undefined,
    theme: data.theme ?? undefined,
    btnColor: data.btnColor ?? undefined,
    links: data.links?.map((link) => ({
      ...link,
      id: link.id?.toString(),
    })),
  };
};

export default function CardCustomizeForm({
  data,
  isEditMode,
  initialData,
  id,
}: CardCustomizeProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { onOpenChange, isOpen } = usePreviewModalStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    defaultValues: transformInitialData(initialData, id),
    mode: "onBlur",
  });

  // Use useWatch to observe all form values for the preview
  const formValues = useWatch({
    control: form.control,
  });
  const debouncedValue = useDebounce(formValues, 1000);

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

  const cardData = useMemo(() => {
    const companyId = debouncedValue.companyId;
    const companyData = data?.find((c) => c.id === companyId);
    const placeholderPhoto = debouncedValue.name
      ? `https://ui-avatars.com/api/?background=random&name=${debouncedValue.name}&size=128`
      : null;

    return {
      ...debouncedValue,

      name: debouncedValue.name || "",
      image: debouncedValue.image || placeholderPhoto,
      company: companyData,
      links: debouncedValue.links?.map((link) => ({
        ...link,
        id: link.id ? parseInt(link.id.toString()) : undefined,
      })),
    } as Person;
  }, [data, debouncedValue]);

  function onSubmit(values: z.infer<typeof cardSchema>) {
    const validation = cardSchema.safeParse(values);
    console.log(validation);

    if (!validation.success) toast.error("Please fill valid details");

    execute(values);
  }

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
            <TabsComp>
              <TabsContent
                value="information"
                className="grid grid-cols-2 gap-4"
              >
                <ImageUploadButton
                  isEditMode={isEditMode}
                  cardData={cardData}
                  setLoading={setLoading}
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

                <EmailsField emails={cardData.emails} />
                <PhonesField phones={cardData.phones} />

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

                <CompanyField companyData={data} />

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
                  <CoverUpload
                    cover={cardData.cover || undefined}
                    setLoading={setLoading}
                  />
                )}
              </TabsContent>
              <TabsContent value="links" className="flex flex-col gap-8">
                <DndLinks loading={loading} open={open} setOpen={setOpen} />

                <AttachmentUpload
                  setLoading={setLoading}
                  filename={cardData.attachmentFileName || undefined}
                  url={cardData.attachmentUrl || undefined}
                />
              </TabsContent>
              <TabsContent
                value="template"
                className="flex flex-col gap-4 overflow-hidden"
              >
                <ScrollArea className="relative flex w-[calc(100svw-2rem)] gap-4 overflow-x-clip px-3 sm:w-auto md:gap-8">
                  <ScrollBar orientation="horizontal" />

                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem className="shrink-0 space-y-3 pb-6">
                        <FormControl>
                          <ThemeSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
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
                      <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
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
                        <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
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
            </TabsComp>

            <Preview
              closeModal={onOpenChange}
              isOpen={isOpen}
              cardData={cardData}
              company={data}
            />
          </div>
          <ActionButtons
            isEditMode={isEditMode}
            disabled={form.formState.isSubmitting || loading}
          />
        </form>
      </Form>
    </main>
  );
}
