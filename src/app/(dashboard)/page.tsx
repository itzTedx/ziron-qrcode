import Image from "next/image";
import Link from "next/link";

import { IconEdit, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getCompanies } from "@/server/actions/get-company";
import { getPlaceholder } from "@/utils/get-placeholder";

import EditCompanyButton from "./_components/edit-company-button";
import ShareButton from "./_components/share-button";

export default async function Home({
  searchParams,
}: {
  searchParams: { default?: string };
}) {
  const { companies } = await getCompanies();

  if (!companies || companies?.length === 0)
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background py-9">
        <Image
          src="/not-available.svg"
          height={200}
          width={200}
          alt="No Cards Available"
        />

        <p className="pt-2 font-semibold text-muted-foreground">
          No Cards or Company Available
        </p>
        <Button className="gap-2" asChild>
          <Link href={`/`}>
            <IconPlus className="size-4" /> Add Company
          </Link>
        </Button>
      </div>
    );

  return (
    <main className="grid gap-8 px-4 py-6 md:px-12">
      {companies.map((company, i) => (
        <Collapsible
          key={company.id}
          className="w-full"
          defaultOpen={company.id === Number(searchParams.default) || i === 0}
        >
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
          <CollapsibleContent
            className={cn(
              "text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              "grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            )}
          >
            {!company.persons.length && (
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
            )}
            {company.persons.map(async (person) => {
              const placeholderImage = await getPlaceholder(person.image);
              const placeholderCover = await getPlaceholder(person.image);
              return (
                <Card
                  className="relative overflow-hidden pt-12"
                  key={person.id}
                >
                  <CardContent className="flex flex-col items-center justify-between p-0">
                    <Image
                      src={person.cover}
                      width={120}
                      height={96}
                      alt=""
                      placeholder="blur"
                      blurDataURL={placeholderCover}
                      className="absolute top-0 h-28 w-full object-cover"
                    />
                    <div className="z-10 flex flex-col items-center pb-3 text-center">
                      <Image
                        src={person.image}
                        height={112}
                        width={112}
                        placeholder="blur"
                        blurDataURL={placeholderImage}
                        alt={`${person.name}'s Photo`}
                        title={`${person.name}'s Photo`}
                        className="size-28 rounded-full border-4 border-background object-cover"
                      />
                      <h3 className="mt-2 font-semibold">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {person.designation}
                      </p>
                    </div>
                    <div className="flex w-full gap-2 border-t p-2">
                      <Button
                        className="w-full gap-1.5 text-sm"
                        variant="ghost"
                        asChild
                      >
                        <Link href={`card/${person.id}`}>
                          <IconEdit className="size-4" />
                          <span className="hidden sm:block">Edit</span>
                        </Link>
                      </Button>
                      <ShareButton
                        data={{
                          url: person.slug!,
                          name: person.name,
                          logo: company.logo,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </main>
  );
}
