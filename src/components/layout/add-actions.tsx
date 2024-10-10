"use client";

import Link from "next/link";

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
            onClick={() => openModal()}
            className="cursor-pointer"
          >
            Company
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/card/new">Digital Card</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b p-6">
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <CompanyForm />
        </DialogContent>
      </Dialog> */}
    </>
  );
}
