"use client";

import { usePathname } from "next/navigation";

import { LINKS } from "./sidebar-navlinks";

export default function HeaderTitle() {
  const pathname = usePathname();

  const currentLink = LINKS.find((link) => link.href === pathname);
  const currentPageTitle = currentLink ? currentLink.label : "Dashboard";

  return (
    <h1 className="text-xl font-semibold md:text-2xl">{currentPageTitle}</h1>
  );
}
