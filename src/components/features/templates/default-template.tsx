import Image from "next/image";
import Link from "next/link";

import {
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconPinned,
} from "@tabler/icons-react";

import { Icons } from "@/components/assets/icons";
import SaveContactButton from "@/components/save-contact-button";
import { cn } from "@/lib/utils";
import { Company, Person } from "@/types";
import { removeExtension } from "@/utils/remove-extension";

interface TemplateProps {
  card?: Person;
  company?: Company[];
  imageBase64URI?: string;
}

export default function DefaultTemplate({
  card,
  company,
  imageBase64URI,
}: TemplateProps) {
  if (!card) return null;

  const companyData = company?.find((c) => c.id === card.companyId);
  return (
    <div className="elative flex h-full w-full flex-col justify-between @sm:h-dvh">
      <div className="no-scrollbar pb-40 md:overflow-y-scroll">
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
                  className="z-30 h-5 object-contain"
                />
              )}
            </div>
            {card.image && (
              <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-background bg-gray-100 @sm:size-32">
                <Image
                  src={card.image}
                  fill
                  alt=""
                  sizes="20vw"
                  className="object-cover"
                />
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

        {card.company || card.emails || card.phones || card.address ? (
          <section className="border-y px-4 py-3 @sm:px-6 @sm:py-4">
            <h2 className="pb-3 text-xs font-medium text-gray-600 @sm:text-sm">
              Contact Info
            </h2>

            <div className="space-y-3 @sm:space-y-6">
              {card.company || companyData ? (
                <Link
                  href={`#`}
                  className="flex items-center gap-2 text-sm @sm:text-base"
                >
                  <IconBuildingSkyscraper className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                  {companyData?.name || card.company?.name}
                </Link>
              ) : null}
              {card.emails &&
                card.emails.map((email) => (
                  <Link
                    key={email.id}
                    href={`mailto:${email.email}`}
                    className="flex items-center gap-2 text-sm @sm:text-base"
                  >
                    <IconMail className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                    {email.email}
                  </Link>
                ))}
              {card.phones &&
                card.phones.map((phone) => (
                  <Link
                    key={phone.id}
                    href={`tel:${phone.phone}`}
                    className="flex items-center gap-2 text-sm @sm:text-base"
                  >
                    <IconPhone className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                    {phone.phone}
                  </Link>
                ))}

              {card.address && (
                <Link
                  href={`#`}
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
                    <Image src={link.icon} fill alt="" sizes="10vw" />
                  </div>
                  <h5 className="font-semibold">{link.label}</h5>
                </Link>
              ))}
            </div>
          </section>
        )}
        {card.attachmentUrl && card.attachmentFileName && (
          <section className="space-y-3 px-4 @sm:space-y-4 @sm:px-8">
            <h2 className="pt-3 text-sm font-medium text-gray-600">
              Attachment
            </h2>
            <div className="space-y-4">
              <Link
                href={card.attachmentUrl}
                download
                className="flex items-center gap-2 rounded-md border p-3 text-sm @sm:text-base"
              >
                <div className="relative size-8 flex-shrink-0">
                  <Icons.pdf />
                </div>
                <h5 className="font-semibold">
                  {removeExtension(card.attachmentFileName)}
                </h5>
              </Link>
            </div>
          </section>
        )}
      </div>
      <div className="sticky bottom-0 mt-auto h-20 w-full max-w-screen-sm bg-background p-4">
        <SaveContactButton data={card} imageBase64={imageBase64URI} />
      </div>
    </div>
  );
}
