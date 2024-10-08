"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const LINKS = [
  {
    label: "Digital Cards",
    href: "/",
  },
  {
    label: "Customize",
    href: "/card",
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <menu className="my-6 space-y-4">
      {LINKS.map((link) => {
        const active = link.href === pathname;
        return (
          <li
            key={link.label}
            className={cn(
              "flex w-full cursor-pointer border-l-8 font-semibold hover:bg-muted",
              active
                ? "border-primary text-primary"
                : "border-background text-gray-600 hover:border-muted"
            )}
          >
            <Link
              href={link.href}
              className="w-full px-6 py-3 transition-transform active:scale-95"
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </menu>
  );
}
