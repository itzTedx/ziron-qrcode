"use client";

import { usePathname } from "next/navigation";

import { IconSearch } from "@tabler/icons-react";

import { Input } from "../ui/input";
import { AddAction } from "./add-actions";
import { LINKS } from "./sidebar-navlinks";

export default function Header() {
  const pathname = usePathname();

  const currentLink = LINKS.find((link) => link.href === pathname);
  const currentPageTitle = currentLink ? currentLink.label : "Dashboard";
  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur-lg md:h-20 md:px-4 lg:px-12">
      <h1 className="text-xl font-semibold md:text-2xl">{currentPageTitle}</h1>
      <div className="flex gap-3">
        <form action="" className="relative">
          <IconSearch className="absolute left-3 top-1/2 size-[1.125rem] -translate-y-1/2 text-gray-600" />
          <Input className="pl-10 md:w-72" placeholder="Search" />
        </form>
        <AddAction />
      </div>
    </div>
  );
}
