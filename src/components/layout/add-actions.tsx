"use client";

import Link from "next/link";
import * as React from "react";

import { Dialog } from "@radix-ui/react-dialog";
import { IconPlus } from "@tabler/icons-react";

import CompanyForm from "@/app/company/company-form";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
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
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Company
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/card">Digital Card</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <CompanyForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5"
            >
              <IconPlus className="size-4" /> Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
