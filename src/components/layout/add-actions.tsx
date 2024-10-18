"use client";

import Link from "next/link";
import { useState } from "react";

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

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <span className="sr-only">Add new company or digital card</span>
            <IconPlus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="">
          <DropdownMenuLabel>Add new</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openModal();
            }}
            className="cursor-pointer"
          >
            Company
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/card/new">Digital Card</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
