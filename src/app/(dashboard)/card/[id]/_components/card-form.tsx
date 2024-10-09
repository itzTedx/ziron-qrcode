"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconPlus,
  IconWorldWww,
} from "@tabler/icons-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cardSchema } from "@/types/card-schema";

export const icons = [
  {
    name: "Instagram",
    icon: IconBrandInstagram,
  },
  {
    name: "Facebook",
    icon: IconBrandFacebook,
  },
  {
    name: "Linkedin",
    icon: IconBrandLinkedin,
  },
  {
    name: "Whatsapp",
    icon: IconBrandWhatsapp,
  },
  {
    name: "Custom Link",
    icon: IconWorldWww,
  },
];

export default function CardForm() {
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  const { fields, append } = useFieldArray({
    name: "links",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof cardSchema>) {
    console.log(values);
  }
  return (
    <Tabs defaultValue="information" className="col-span-6 w-full items-start">
      <TabsList className="w-full">
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
        <TabsTrigger value="template">Template</TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <TabsContent value="information" className="grid grid-cols-2 gap-4">
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
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@company.com"
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
          </TabsContent>
          <TabsContent value="links">
            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`links.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 flex w-full gap-1.5"
                onClick={() => append({ value: "" })}
              >
                <IconPlus className="size-4" />
                Add Link
              </Button>

              <div className="mt-9">
                <div className="flex justify-between">
                  <p>Suggestions</p>
                  <Button variant="link" className="gap-1.5">
                    View all <IconArrowRight className="size-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6.2rem,1fr))] gap-3">
                  {icons.map((link, i) => (
                    <div
                      className="flex flex-col items-center rounded-md border bg-background p-3"
                      key={i}
                    >
                      <link.icon className="size-12 stroke-[1.5]" />
                      <p className="text-xs font-medium">{link.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="template">
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Themes</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" type="color" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <h5>Customize Theme</h5>
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Background</FormLabel>
                  <FormControl className="flex">
                    <div>
                      <Input
                        placeholder="Full Name"
                        type="color"
                        {...field}
                        className="size-8 rounded-full p-0"
                      />
                      <Input
                        placeholder="Full Name"
                        type="color"
                        {...field}
                        className="size-8 rounded-full p-0"
                      />
                      <Input
                        placeholder="Full Name"
                        type="color"
                        {...field}
                        className="size-8 rounded-full p-0"
                      />
                      <Input
                        placeholder="Full Name"
                        type="color"
                        defaultValue="#000"
                        {...field}
                        className="size-8 rounded-full p-0"
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <Button type="submit" className="mt-9">
            Submit
          </Button>
        </form>
      </Form>
    </Tabs>
  );
}
