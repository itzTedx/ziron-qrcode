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

import EditCompanyButton from "./_components/edit-company-button";
import ShareButton from "./_components/share-button";

export default async function Home() {
  const { companies } = await getCompanies();

  if (!companies) return "";

  return (
    <main className="grid gap-8 px-4 py-6 md:px-12">
      {companies.map((company, i) => (
        <Collapsible key={company.id} className="w-full" defaultOpen={i === 0}>
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
              "grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-4 pt-3"
            )}
          >
            {!company.persons.length && (
              <div className="col-span-full flex w-full flex-col items-center justify-center gap-3 rounded-md border bg-white py-9">
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
            {company.persons.map((person) => (
              <Card
                className="p-4 transition-colors duration-500 hover:border-primary"
                key={person.id}
              >
                <CardContent className="flex flex-col items-center justify-between p-0">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src={person.image}
                      height={120}
                      width={120}
                      alt={`${person.name}'s Photo`}
                      title={`${person.name}'s Photo`}
                      className="size-28 rounded-full object-cover"
                    />
                    <h3 className="mt-2 font-semibold">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {person.designation}
                    </p>
                  </div>
                  <div className="flex w-full gap-2 pt-4">
                    <Button
                      className="w-full gap-1.5 text-sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`card/${person.id}`}>
                        <IconEdit className="size-4" /> Edit
                      </Link>
                    </Button>
                    <ShareButton name={person.name} slug={person.slug!} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </main>
  );
}
