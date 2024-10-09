import Image from "next/image";

import { IconEdit, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { getCompanies } from "@/server/actions/get-company";

export default async function Home() {
  const { companies, error } = await getCompanies();

  if (!companies) return "";

  return (
    <main className="px-4 py-6 md:px-12">
      {companies.map((company) => (
        <div key={company.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full border bg-white p-1">
              <Image
                src={company.logo!}
                alt={`${company.name}'s Logo`}
                title={`${company.name}'s Logo`}
                height={35}
                width={35}
                className="size-4 object-contain"
              />
            </div>
            <h2 className="font-medium capitalize">{company.name}</h2>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline">
              <IconEdit />
            </Button>
            <Button size="icon" variant="outline">
              <IconPlus />
            </Button>
          </div>
        </div>
      ))}
    </main>
  );
}
