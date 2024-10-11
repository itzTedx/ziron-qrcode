import Image from "next/image";
import Link from "next/link";

import {
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconPinned,
} from "@tabler/icons-react";

import LinkCard from "@/app/(dashboard)/card/[id]/_components/links-card";
import SaveContactButton from "@/components/save-contact-button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DefaultTemplate({ card }: { card?: any }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between">
      <div className="no-scrollbar md:overflow-y-scroll">
        <header className="w-full">
          <div className="relative">
            <div className="absolute h-32 w-full bg-gradient-to-b from-background/30 to-transparent" />
            <div
              className="@sm:h-32 flex h-24 w-full items-start justify-center bg-cover bg-center bg-no-repeat pt-4"
              style={{
                backgroundImage: `url(${card.cover && card.cover})`,
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
            {card.image && (
              <div className="@sm:size-32 absolute left-1/2 top-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-background bg-gray-100">
                <Image src={card.image} fill alt="" />
              </div>
            )}
          </div>
          <section className="@sm:mt-12 mt-8 space-y-0.5 px-8 py-4 text-center">
            {card.name && (
              <h1 className="@sm:text-2xl text-xl font-bold">{card.name}</h1>
            )}
            {card.designation && (
              <h2 className="@sm:text-sm text-xs">{card.designation}</h2>
            )}
            {card.bio && (
              <p className="@sm:text-xs text-balance text-[10px]">{card.bio}</p>
            )}
          </section>
        </header>
        {card.company && (
          <section className="@sm:px-6 @sm:py-4 border-y px-4 py-3">
            <h2 className="@sm:text-sm pb-3 text-xs font-medium text-gray-600">
              Contact Info
            </h2>
            <div className="@sm:space-y-6 space-y-3">
              {card.company.name && (
                <Link
                  href={`https://www.google.com/maps/place/${card.company.name}`}
                  className="@sm:text-base flex items-center gap-2 text-sm"
                >
                  <IconBuildingSkyscraper className="@sm:size-5 size-4 flex-shrink-0 stroke-[1.5]" />
                  {card.company.name}
                </Link>
              )}
              {card.email && (
                <Link
                  href={`mailto:${card.email}`}
                  className="@sm:text-base flex items-center gap-2 text-sm"
                >
                  <IconMail className="@sm:size-5 size-4 flex-shrink-0 stroke-[1.5]" />
                  {card.email}
                </Link>
              )}
              {card.phone && (
                <Link
                  href={`tel:${card.phone}`}
                  className="@sm:text-base flex items-center gap-2 text-sm"
                >
                  <IconPhone className="@sm:size-5 size-4 flex-shrink-0 stroke-[1.5]" />
                  {card.phone}
                </Link>
              )}
              {card.address && (
                <Link
                  href={`https://www.google.com/maps/place/${card.address}`}
                  className="@sm:text-base flex items-start gap-2 text-sm"
                >
                  <IconPinned className="@sm:size-5 mt-1.5 size-4 flex-shrink-0 stroke-[1.5]" />
                  {card.address}
                </Link>
              )}
            </div>
          </section>
        )}
        {card.links && (
          <section className="@sm:space-y-4 @sm:px-8 space-y-3 px-4">
            <h2 className="pt-3 text-sm font-medium text-gray-600">Links</h2>
            <LinkCard />
          </section>
        )}
      </div>
      <div className="sticky bottom-0 mt-auto h-20 w-full max-w-screen-sm bg-background p-4">
        <SaveContactButton data={card} />
      </div>
    </div>
  );
}
