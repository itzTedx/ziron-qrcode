"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LINKS } from "./sidebar-navlinks";

export default function HeaderTitle() {
  const pathname = usePathname();

  const currentLink = LINKS.find((link) => link.href === pathname);
  const currentPageTitle = currentLink ? currentLink.label : "Dashboard";

  return (
    <Link href="/" className="text-xl font-semibold md:text-2xl">
      {currentPageTitle}
    </Link>
  );
}
