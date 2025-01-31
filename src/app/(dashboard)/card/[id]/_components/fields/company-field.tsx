import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

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
  companyId: number;
}

export const CompanyField = ({ companyData: data, companyId }: Props) => {
  const [openPopover, setOpenPopover] = useState(false);
  const openCompanyModal = useCompanyFormModal((state) => state.openModal);
  const form = useFormContext<zCardSchema>();

  // Memoize company lookup
  const selectedCompany = useMemo(() => {
    return data.find((cat) => cat.id === companyId);
  }, [data, companyId]);

  // Memoize selection handler
  const handleSelect = useCallback(
    (companyId?: string) => {
      if (companyId) {
        form.setValue("companyId", parseInt(companyId));
        setOpenPopover(false);
      }
    },
    [form]
  );

  // Memoize modal handler
  const handleModalOpen = useCallback(() => {
    setOpenPopover(false);
    openCompanyModal();
  }, [openCompanyModal]);

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
                  {selectedCompany ? (
                    <span className="inline-flex gap-2.5">
                      <Image
                        src={
                          selectedCompany.logo ||
                          "/images/placeholder-cover.jpg"
                        }
                        height={16}
                        width={16}
                        alt={`${selectedCompany.name} logo`}
                        priority
                      />
                      <span>{selectedCompany.name}</span>
                    </span>
                  ) : (
                    "Select Category"
                  )}
                  <IconCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 sm:w-[19.5rem]">
              <Command>
                <CommandInput placeholder="Search Category..." />
                <CommandEmpty>Company not found</CommandEmpty>
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandGroup heading="Companies">
                    {data.map((cat) => (
                      <CommandItem
                        value={cat.name}
                        className="cursor-pointer gap-2.5 px-4 py-2.5 font-medium"
                        key={cat.id}
                        onSelect={() => handleSelect(cat.id?.toString())}
                      >
                        <Image
                          src={cat.logo || "/images/placeholder-cover.jpg"}
                          height={16}
                          width={16}
                          alt={`${cat.name} logo`}
                          loading="lazy"
                        />
                        <span>{cat.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="New Company?">
                    <CommandItem
                      className="cursor-pointer px-4 py-2.5 font-medium"
                      onSelect={handleModalOpen}
                    >
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
