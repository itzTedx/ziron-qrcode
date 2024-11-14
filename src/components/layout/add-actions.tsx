"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompanyFormModal } from "@/store/use-company-form-modal";

export function AddAction() {
  const openModal = useCompanyFormModal((state) => state.openModal);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        router.push("/card/new");
      }
      if (e.key === "D" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }
        e.preventDefault();
        openModal();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router, openModal]);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <span className="sr-only">Add new company or digital card</span>
            <IconPlus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[10rem]">
          <DropdownMenuLabel>Add new</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openModal();
            }}
            className="group cursor-pointer transition hover:bg-secondary hover:text-background"
          >
            Company
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center justify-center gap-1 rounded border bg-muted px-1.5 align-top font-mono text-xs font-medium opacity-100 sm:flex">
              <span className="text-[9px]">⌘ </span>{" "}
              <span className="-mt-[0.13rem] text-[12px]">⇧ </span>
              <span className="-mt-0.5">D</span>
            </kbd>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group transition hover:bg-secondary hover:text-background"
            onClick={() => setOpen(false)}
          >
            <Link href="/card/new">
              Digital Card
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center justify-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                <span className="text-[9px]">⌘</span>{" "}
                <span className="-mt-0.5">D</span>
              </kbd>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
