import { getCurrentUser } from "@/lib/auth/current-user";
import { getCompanies } from "@/server/actions/get-company";

import { SidebarTrigger } from "../ui/sidebar";
import { AddAction } from "./add-actions";
import HeaderTitle from "./header-title";
import { Search } from "./search";
import { ThemeToggle } from "./theme-actions";

export default async function Header() {
  const { companies } = await getCompanies();
  const user = await getCurrentUser();
  const isAdmin = user?.role == "admin";

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-3 border-b bg-background/80 px-2 py-2 backdrop-blur-lg sm:px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {/* <MobileSidebar /> */}
        <HeaderTitle />
      </div>
      <div className="flex gap-2 sm:gap-3">
        <Search data={companies!} />
        <ThemeToggle />
        {isAdmin && <AddAction />}
      </div>
    </header>
  );
}
