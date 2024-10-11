import Link from "next/link";

import { Logo } from "../assets/logo";
import NavLinks from "./sidebar-navlinks";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh border-r bg-background lg:block">
      <Link
        href="/"
        className="flex h-20 items-center justify-center border-b px-6 transition-transform active:scale-95"
      >
        <Logo />
      </Link>
      <NavLinks />
    </aside>
  );
}
