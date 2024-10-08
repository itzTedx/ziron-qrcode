"use client";

import Link from "next/link";
import * as React from "react";

import { IconPlus } from "@tabler/icons-react";

import CompanyForm from "@/app/company/company-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AddAction() {
  const [open, setIsOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <span className="sr-only">Add new company or digital card</span>
            <IconPlus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Add new</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            Company
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/card">Digital Card</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b p-6">
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <CompanyForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
