import Image from "next/image";
import { useState } from "react";

import { IconCaretUpDownFilled } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCompanyFormModal } from "@/store/use-company-form-modal";
import { Company } from "@/types";
import { zCardSchema } from "@/types/card-schema";

interface Props {
  companyData: Company[];
}

export const CompanyField = ({ companyData: data }: Props) => {
  const [openPopover, setOpenPopover] = useState(false);

  const openCompanyModal = useCompanyFormModal((state) => state.openModal);
  const form = useFormContext<zCardSchema>();
  return (
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
                    ? data.find((cat) => cat.id === field.value) && (
                        <span className="inline-flex gap-2.5">
                          <Image
                            src={
                              data.find((cat) => cat.id === field.value)
                                ?.logo || "images/placeholder-cover.jpg"
                            }
                            height={16}
                            width={16}
                            alt=""
                          />

                          <span>
                            {data.find((cat) => cat.id === field.value)?.name}
                          </span>
                        </span>
                      )
                    : "Select Category"}
                  <IconCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 sm:w-[19.5rem]">
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
                          src={cat.logo || "images/placeholder-cover.jpg"}
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
  );
};
