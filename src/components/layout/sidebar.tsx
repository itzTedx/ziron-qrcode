import { Logo } from "../assets/logo";
import NavLinks from "./sidebar-navlinks";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-dvh border-r">
      <div className="flex h-20 items-center justify-center border-b px-6">
        <Logo />
      </div>
      <NavLinks />
    </aside>
  );
}
