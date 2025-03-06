"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ColorsInput from "@/components/test/colors-input";
import { Button } from "@/components/ui/button";
import {
  InfoTooltip,
  SimpleTooltipContent,
} from "@/components/ui/custom/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { createCard } from "@/server/actions/create-card";
import { usePreviewModalStore } from "@/store/use-preview-modal";
import { Company, Person } from "@/types";
import { cardSchema } from "@/types/card-schema";

import { ActionButtons } from "../_components/buttons/action-buttons";
import { AttachmentUpload } from "../_components/buttons/attachment-upload";
import { CoverUpload } from "../_components/buttons/cover-upload";
import { ImageUploadButton } from "../_components/buttons/image-upload-button";
import { DndLinks } from "../_components/dnd-links";
import { CompanyField } from "../_components/fields/company-field";
import { EmailsField } from "../_components/fields/emails-field";
import { PhonesField } from "../_components/fields/phones-field";
import { Preview } from "../_components/preview";
import ProfileDashboard from "../_components/profile-dashboard";
import { TabsComp } from "../_components/tabs";
import { ThemeSelector } from "../_components/theme-selector";
import { transformInitialData } from "../utils";

interface CardCustomizeProps {
  data: Company[];
  isEditMode: boolean;
  initialData?: Person;
  id: string;
}

// Memoize child components
const MemoizedProfileDashboard = memo(ProfileDashboard);
const MemoizedPreview = memo(Preview);
const MemoizedTabsComp = memo(TabsComp);

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

  // Optimize form initialization
  const defaultValues = useMemo(
    () => transformInitialData(initialData, id),
    [initialData, id]
  );

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    defaultValues,
    mode: "onChange",
  });

  // Optimize form watching
  const formValues = useWatch({
    control: form.control,
  });
  const debouncedValue = useDebounce(formValues, 100);

  // Memoize company ID effect
  useEffect(() => {
    const companyIdParams = searchParams.get("company");
    if (companyIdParams) {
      form.setValue("companyId", parseInt(companyIdParams));
    }
  }, [searchParams, form]);

  // Optimize action handler
  const { execute } = useAction(createCard, {
    onExecute: useCallback(() => {
      toast.loading("Loading");
      setLoading(true);
    }, []),
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push(`/?default=${data?.company}`);
        toast.dismiss();
        toast.success(data.success);
        setLoading(false);
      }
    },

    onError: useCallback(() => {
      toast.error("Something went wrong.");
      setLoading(false);
    }, []),
  });

  // Memoize card data transformation
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

  /** Debugging */
  const validation = cardSchema.safeParse(debouncedValue);
  // console.log("Validations: ", validation);

  // Optimize submit handler
  const onSubmit = useCallback(
    (values: z.infer<typeof cardSchema>) => {
      const validation = cardSchema.safeParse(values);
      if (!validation.success) {
        toast.error("Please fill valid details");
        return;
      }
      execute(values);
    },
    [execute]
  );

  return (
    <main className="relative pb-9 sm:pb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isEditMode && "mt-4", "relative")}
        >
          {isEditMode && initialData && (
            <MemoizedProfileDashboard data={cardData} loading={loading} />
          )}

          <div
            className={cn(
              "container grid max-w-7xl gap-8 py-3 pb-9 md:grid-cols-12 md:py-9",
              !isEditMode && "mt-14"
            )}
          >
            <MemoizedTabsComp>
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
                        <Textarea
                          placeholder="Address"
                          {...field}
                          className="min-h-[2rem] [field-sizing:content]"
                        />
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

                <CompanyField
                  companyData={data}
                  companyId={cardData.companyId}
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
                          className="[field-sizing:content]"
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
                <Label className="text-sm font-medium leading-none text-foreground">
                  Choose a theme
                </Label>
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
                    name={"isDarkMode"}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
                        <FormLabel className="flex items-center gap-1.5">
                          Dark Mode
                          <InfoTooltip
                            content={
                              <SimpleTooltipContent title="Display your logo in the center of the QR code." />
                            }
                          />
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                              <Switch
                                id="logo"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                              />
                              <span className="min-w-78 pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                                <span className="text-[10px] font-medium uppercase">
                                  Off
                                </span>
                              </span>
                              <span className="min-w-78 pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-white rtl:peer-data-[state=checked]:translate-x-full">
                                <span className="text-[10px] font-medium uppercase">
                                  On
                                </span>
                              </span>
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            </MemoizedTabsComp>

            <MemoizedPreview
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
