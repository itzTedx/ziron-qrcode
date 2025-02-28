import Image from "next/image";
import Link from "next/link";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getAbsoluteUrl } from "@/lib/get-absolute-url";
import { cn } from "@/lib/utils";
import { getCompanies } from "@/server/actions/get-company";
import { getPlaceholder } from "@/utils/get-placeholder";

import EditCompanyButton from "./_components/edit-company-button";
import { NothingFound } from "./_components/nothing-found";
import { PersonCard } from "./_components/person-card";

interface HomeProps {
  searchParams: { default?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const { companies } = await getCompanies();

  if (!companies?.length) return <NothingFound />;

  return (
    <section className="mt-20 grid gap-8 px-4 py-6 md:px-12">
      {companies.map((company, i) => (
        <Collapsible
          key={company.id}
          className="w-full"
          defaultOpen={company.id === Number(searchParams.default) || i === 0}
        >
          {/* Company Header */}
          <div className="flex w-full cursor-pointer items-center justify-between border-b pb-3">
            <CollapsibleTrigger asChild>
              <div className="flex w-full items-center gap-3">
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
            </CollapsibleTrigger>
            <div className="flex gap-2">
              <EditCompanyButton initialData={company} />
              <Button size="icon" variant="outline" asChild>
                <Link href={`/card/new?company=${company.id}`}>
                  <IconPlus className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Company Content */}
          <CollapsibleContent
            className={cn(
              "text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              "grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            )}
          >
            {!company.persons.length ? (
              <div className="col-span-full flex w-full flex-col items-center justify-center gap-3 rounded-md border bg-background py-9">
                <Image
                  src="/not-available.svg"
                  height={200}
                  width={200}
                  alt="No Cards Available"
                />
                <p className="pt-2 font-semibold text-muted-foreground">
                  No Cards Available
                </p>
                <Button className="gap-2" asChild>
                  <Link href={`/card/new?company=${company.id}`}>
                    <IconPlus className="size-4" /> Add Card
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {company.persons.map(async (person) => {
                  const cover = getAbsoluteUrl(
                    person.cover,
                    process.env.NEXT_PUBLIC_BASE_PATH as string
                  );
                  const placeholderImage = await getPlaceholder(person.image);
                  const placeholderCover = await getPlaceholder(cover);

                  return (
                    <PersonCard
                      key={person.id}
                      person={{ ...person, company }}
                      placeholderImage={placeholderImage}
                      placeholderCover={placeholderCover}
                    />
                  );
                })}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </section>
  );
}
