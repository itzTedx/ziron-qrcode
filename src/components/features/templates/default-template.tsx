import Image from "next/image";
import Link from "next/link";

import {
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconPinned,
} from "@tabler/icons-react";

import SaveContactButton from "@/components/save-contact-button";
import { cn } from "@/lib/utils";
import { Company, Person } from "@/types";

interface TemplateProps {
  card?: Person;
  company?: Company[];
}

export default function DefaultTemplate({ card, company }: TemplateProps) {
  const companyData = company?.find((c) => c.id === card?.companyId);

  if (!card) return null;
  return (
    <div className="relative flex h-full w-full flex-col justify-between @sm:h-dvh">
      <div className="no-scrollbar md:overflow-y-auto">
        <header className="w-full">
          <div className="relative">
            <div className="absolute h-32 w-full bg-gradient-to-b from-background/30 to-transparent" />
            <div
              className="flex h-24 w-full items-start justify-center bg-cover bg-center bg-no-repeat pt-4 @sm:h-32"
              style={{
                backgroundImage: `url(${card.cover ? card.cover : "/images/placeholder-cover.jpg"})`,
              }}
            >
              {card.company && card.company.logo && (
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
              <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-background bg-gray-100 @sm:size-32">
                <Image src={card.image} fill alt="" className="object-cover" />
              </div>
            )}
          </div>
          <section
            className={cn(
              "space-y-0.5 px-8 py-4 text-center",
              card.image ? "mt-8 @sm:mt-12" : ""
            )}
          >
            {card.name && (
              <h1 className="text-xl font-bold @sm:text-2xl">{card.name}</h1>
            )}
            {card.designation && (
              <h2 className="text-xs @sm:text-sm">{card.designation}</h2>
            )}
            {card.bio && (
              <p className="text-balance text-[10px] @sm:text-xs">{card.bio}</p>
            )}
          </section>
        </header>

        {card.company || card.email || card.phone || card.address ? (
          <section className="border-y px-4 py-3 @sm:px-6 @sm:py-4">
            <h2 className="pb-3 text-xs font-medium text-gray-600 @sm:text-sm">
              Contact Info
            </h2>

            <div className="space-y-3 @sm:space-y-6">
              {card.company || companyData ? (
                <Link
                  href={`https://www.google.com/maps/place/${companyData?.name || card.company?.name}`}
                  className="flex items-center gap-2 text-sm @sm:text-base"
                >
                  <IconBuildingSkyscraper className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                  {companyData?.name || card.company?.name}
                </Link>
              ) : null}
              {card.email && (
                <Link
                  href={`mailto:${card.email}`}
                  className="flex items-center gap-2 text-sm @sm:text-base"
                >
                  <IconMail className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                  {card.email}
                </Link>
              )}
              {card.phone && (
                <Link
                  href={`tel:${card.phone}`}
                  className="flex items-center gap-2 text-sm @sm:text-base"
                >
                  <IconPhone className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                  {card.phone}
                </Link>
              )}
              {card.address && (
                <Link
                  href={`https://www.google.com/maps/place/${card.address}`}
                  className="flex items-start gap-2 text-sm @sm:text-base"
                >
                  <IconPinned className="mt-1.5 size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                  {card.address}
                </Link>
              )}
            </div>
          </section>
        ) : null}
        {card.links && card.links.length > 0 && (
          <section className="space-y-3 px-4 @sm:space-y-4 @sm:px-8">
            <h2 className="pt-3 text-sm font-medium text-gray-600">Links</h2>
            <div className="space-y-4">
              {card.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className="flex items-center gap-2 rounded-md border p-3 text-sm @sm:text-base"
                >
                  <div className="relative size-8 flex-shrink-0">
                    <Image src={link.icon} fill alt="" sizes="100vw" />
                  </div>
                  <h5 className="font-semibold">{link.label}</h5>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="sticky bottom-0 mt-auto h-20 w-full max-w-screen-sm bg-background p-4">
        <SaveContactButton data={card} />
      </div>
    </div>
  );
}
