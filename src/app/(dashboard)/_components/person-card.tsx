import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Company, Person } from "@/types";

import ShareButton from "./share-button";

interface PersonCardProps {
  person: Person & { company: Company };
  placeholderImage?: string;
  placeholderCover?: string;
}

export const PersonCard = memo(
  ({ person, placeholderImage, placeholderCover }: PersonCardProps) => {
    return (
      <Card className="relative overflow-hidden pt-10 md:pt-12">
        <CardContent className="flex flex-col items-center justify-between p-0">
          <Image
            src={person.cover!}
            width={260}
            height={112}
            alt="Cover Image"
            placeholder="blur"
            blurDataURL={placeholderCover}
            quality={70}
            className="absolute top-0 h-24 w-full object-cover md:h-28"
          />
          <div className="z-10 flex flex-col items-center pb-3 text-center">
            <Image
              src={person.image!}
              height={112}
              width={112}
              placeholder="blur"
              blurDataURL={placeholderImage}
              alt={`${person.name}'s Photo`}
              title={`${person.name}'s Photo`}
              className="size-24 rounded-full border-4 border-background object-cover md:size-28"
            />
            <h3 className="mt-2 font-semibold">{person.name}</h3>
            <p className="text-sm text-muted-foreground">
              {person.designation}
            </p>
          </div>
          <div className="flex w-full gap-2 border-t p-2">
            <Button className="w-full gap-1.5 text-sm" variant="ghost" asChild>
              <Link href={`card/${person.id}`}>
                <IconEdit className="size-4" />
                <span className="hidden sm:block">Edit</span>
              </Link>
            </Button>
            <ShareButton
              data={{
                url: person.slug!,
                name: person.name,
                logo: person.company.logo,
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

PersonCard.displayName = "PersonCard";
