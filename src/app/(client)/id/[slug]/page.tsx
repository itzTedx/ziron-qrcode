import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconPinned,
} from "@tabler/icons-react";

import LinkCard from "@/app/(dashboard)/card/[id]/_components/links-card";
import { getCardBySlug } from "@/server/actions/get-card-by-slug";

import SaveContactButton from "../../_components/save-contact-button";

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const { card } = await getCardBySlug(params.slug);

  if (!card) notFound();

  return (
    <div className="relative flex h-full w-full flex-col justify-between">
      <div className="md:overflow-y-scroll">
        <header className="w-full">
          <div className="relative">
            <div className="absolute h-32 w-full bg-gradient-to-b from-background/30 to-transparent" />
            <div
              className="flex h-32 w-full items-start justify-center bg-cover bg-center bg-no-repeat pt-4"
              style={{
                backgroundImage: `url(${card?.cover})`,
              }}
            >
              {card.company.logo && (
                <Image
                  src={card.company.logo}
                  height={100}
                  width={100}
                  alt="cover"
                  className="z-30 h-5"
                />
              )}
            </div>
            <div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 overflow-hidden rounded-full border-4 border-background bg-gray-100">
              <Image src={card.image} fill alt="" />
            </div>
          </div>
          <section className="mt-12 space-y-0.5 px-8 py-4 text-center">
            <h1 className="text-2xl font-semibold">{card.name}</h1>
            <h2 className="text-sm">{card.designation}</h2>
            <p className="text-balance text-xs">{card.bio}</p>
          </section>
        </header>
        <section className="border-y px-8 py-4">
          <h2 className="pb-3 text-sm font-medium text-gray-600">
            Contact Info
          </h2>
          <div className="space-y-6">
            <Link
              href={`https://www.google.com/maps/place/${card.company.name}`}
              className="flex items-center gap-2"
            >
              <IconBuildingSkyscraper className="flex-shrink-0 stroke-[1.5]" />{" "}
              {card.company.name}
            </Link>
            <Link
              href={`mailto:${card.email}`}
              className="flex items-center gap-2"
            >
              <IconMail className="flex-shrink-0 stroke-[1.5]" /> {card.email}
            </Link>
            <Link
              href={`tel:${card.phone}`}
              className="flex items-center gap-2"
            >
              <IconPhone className="flex-shrink-0 stroke-[1.5]" /> {card.phone}
            </Link>
            <Link
              href={`https://www.google.com/maps/place/${card.address}`}
              className="flex items-center gap-2"
            >
              <IconPinned className="flex-shrink-0 stroke-[1.5]" />{" "}
              {card.address}
            </Link>
          </div>
        </section>
        <section className="space-y-4 px-8">
          <h2 className="pt-3 text-sm font-medium text-gray-600">Links</h2>
          <LinkCard />
          <LinkCard />
          <LinkCard />
        </section>
      </div>
      <div className="sticky bottom-0 mt-auto h-20 w-full max-w-screen-sm bg-background p-4">
        <SaveContactButton data={card} />
      </div>
    </div>
  );
}
