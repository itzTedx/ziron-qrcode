"use client";

import { IconPlus, IconX } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zCardSchema } from "@/types/card-schema";

interface Props {
  phones?: {
    phone?: string | null;
    label?: string | null;
  }[];
}

export const PhonesField = ({ phones }: Props) => {
  const form = useFormContext<zCardSchema>();
  const { fields, append, remove } = useFieldArray({
    name: "phones",
    control: form.control,
  });

  return (
    <div className="col-span-2 sm:col-span-1">
      {fields.map((field, index) => (
        <div className="flex w-full items-end" key={field.id}>
          <FormField
            control={form.control}
            name={`phones.${index}.phone`}
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Phone
                  </FormLabel>
                  <FormMessage />
                </div>
                <FormControl className="w-full">
                  <Input
                    type="tel"
                    {...field}
                    placeholder="+971 98 765 4321"
                    className={cn("w-full rounded-e-none border-r-0")}
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
                <FormLabel className={"sr-only"}>Phone Label</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      tabIndex={-1}
                      className={cn(
                        "w-24 shrink-0 rounded-none text-xs font-medium text-muted-foreground",
                        fields.length === 1
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
                    <SelectItem value="personal">Personal</SelectItem>
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
              remove(index);
            }}
            className={cn(
              "shrink-0",
              fields.length > 1 ? "flex rounded-s-none" : "hidden"
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
          if (phones) {
            const lastPhoneField = phones[fields.length - 1];

            console.log(lastPhoneField);
            if (lastPhoneField && !lastPhoneField.phone) {
              // Do not add a new phone field if the last one is empty
              toast.error("Please add a email before adding another.");
              return;
            }
          }
          append({ phone: "", label: "primary" });
        }}
      >
        <IconPlus className="mr-2 size-4" />
        Add another number
      </Button>
    </div>
  );
};
