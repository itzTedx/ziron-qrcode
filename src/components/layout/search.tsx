"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import {
  IconBuilding,
  IconPlus,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Company } from "@/types";

import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface SearchProps {
  data: Company[];
}

export function Search({ data }: SearchProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        aria-keyshortcuts="/"
        className={cn(
          "relative h-10 w-10 justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none transition-all max-sm:px-2.5 sm:w-52 sm:pr-12 md:w-64 lg:w-72"
        )}
        onClick={() => setOpen(true)}
      >
        <IconSearch className="size-4 flex-shrink-0 sm:mr-2.5 sm:text-muted-foreground/60" />
        <span className="hidden sm:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center justify-center gap-1 rounded border bg-muted/30 px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Cards or Company..." />
        <CommandList>
          <CommandEmpty>No cards found.</CommandEmpty>
          {data?.map((company) => (
            <CommandGroup key={company.id} heading={company.name}>
              {company.persons!.map((person) => (
                <CommandItem
                  value={person.slug!}
                  key={person.id}
                  onSelect={() => {
                    runCommand(() => router.push(`/card/${person.id}`));
                  }}
                >
                  <IconUser className="mr-2 size-4 text-muted-foreground" />{" "}
                  {person.name}
                </CommandItem>
              ))}
              {company?.persons!.length && (
                <>
                  <CommandItem
                    value={`new-${company.name}`}
                    className="justify-between"
                    onSelect={() => {
                      runCommand(() =>
                        router.push(`/card/new?company=${company.id}`)
                      );
                    }}
                  >
                    <p className="px-2 text-xs text-muted-foreground/60">
                      No Cards Found
                    </p>
                    <div className="flex text-muted-foreground">
                      <IconPlus className="mr-1 size-3 p-0.5" />
                      Add new
                    </div>
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          ))}
          <CommandGroup heading="Companies">
            {data?.map((company) => (
              <CommandItem
                key={company.id}
                value={company.name}
                onSelect={() => {
                  runCommand(() => router.push("/"));
                }}
              >
                <IconBuilding className="mr-2 size-4 text-muted-foreground" />
                {company.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
