import { getCompanies } from "@/server/actions/get-company";

import { AddAction } from "./add-actions";
import HeaderTitle from "./header-title";
import { Search } from "./search";

export default async function Header() {
  const { companies } = await getCompanies();

  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur-lg md:h-20 md:px-4 lg:px-12">
      <HeaderTitle />
      <div className="flex gap-3">
        <Search data={companies!} />
        <AddAction />
      </div>
    </div>
  );
}
