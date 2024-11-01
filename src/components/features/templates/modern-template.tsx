import Image from "next/image";
import Link from "next/link";

import { IconMail, IconPhone, IconPinned } from "@tabler/icons-react";

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

export default function ModernTemplate({
  card,
  company,
  imageBase64URI,
}: TemplateProps) {
  if (!card) return null;

  const companyData = company?.find((c) => c.id === card.companyId);
  return (
    <div className="relative flex h-full w-full flex-col justify-between @sm:h-dvh">
      <div className="no-scrollbar md:overflow-y-scroll">
        <header className="mb-9 w-full">
          <div className="relative">
            <section
              className="relative bg-primary"
              style={{
                aspectRatio: "16/9",

                maskImage:
                  "url(\"data:image/svg+xml,%3Csvg width='445' height='218' viewBox='0 0 445 218' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M222.5 179.725C80.8333 179.725 0 218 0 218V0H445V218C445 218 364.167 179.725 222.5 179.725Z' fill='%234A3AFF'/%3E%3C/svg%3E\")",
                WebkitMaskImage:
                  "url(\"data:image/svg+xml,%3Csvg width='445' height='218' viewBox='0 0 445 218' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M222.5 179.725C80.8333 179.725 0 218 0 218V0H445V218C445 218 364.167 179.725 222.5 179.725Z' fill='%234A3AFF'/%3E%3C/svg%3E\")",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskSize: "contain",
                WebkitMaskSize: "contain",
              }}
            >
              <div className="absolute top-3 z-50 flex h-24 w-full items-start justify-center bg-cover bg-center bg-no-repeat pt-4 @sm:h-32">
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
              {card.cover && (
                <Image
                  src={card.cover}
                  height={412}
                  width={230}
                  alt="cover"
                  className="w-full"
                />
              )}
            </section>
            {card.image && (
              <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-primary bg-gray-100 @sm:size-32">
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

          <section className={cn("space-y-0.5 px-8 py-4 text-center")}>
            {card.name && (
              <h1 className="text-xl font-bold @sm:text-2xl">{card.name}</h1>
            )}
            {card.company || companyData ? (
              <h2 className="font-medium text-primary">
                {companyData?.name || card.company?.name}
              </h2>
            ) : null}
            {card.designation && (
              <h2 className="text-xs @sm:text-sm">{card.designation}</h2>
            )}
            {card.bio && (
              <p className="text-balance text-[10px] @sm:text-xs">{card.bio}</p>
            )}
          </section>
          <section className="mt-4 flex w-full flex-col space-y-3 px-8">
            <Link
              href={`tel:${card.phone}`}
              className="flex h-10 w-full items-center justify-center rounded-full border-2 border-primary px-6 text-center font-semibold text-primary @sm:h-12"
            >
              Call me now!
            </Link>

            <SaveContactButton
              data={card}
              imageBase64={imageBase64URI}
              className="h-10 rounded-full @sm:h-12"
            />
          </section>
        </header>

        {card.company || card.email || card.phone || card.address ? (
          <section className="space-y-3 px-4 @sm:space-y-4 @sm:px-8">
            <h2 className="sr-only">Contact Info</h2>

            <div className="grid grid-cols-3 gap-4">
              {card.email && (
                <Link
                  href={`mailto:${card.email}`}
                  className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-3 text-sm @sm:p-5 @sm:text-base"
                >
                  <IconMail className="size-9 flex-shrink-0 stroke-[1.5] @sm:size-16" />
                  <p className="sr-only">{card.email}</p>
                </Link>
              )}
              {card.phone && (
                <Link
                  href={`tel:${card.phone}`}
                  className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-3 text-sm @sm:p-5 @sm:text-base"
                >
                  <IconPhone className="size-9 flex-shrink-0 stroke-[1.5] @sm:size-16" />
                  <p className="sr-only"> {card.phone}</p>
                </Link>
              )}
              {card.address && (
                <Link
                  href={`#`}
                  className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-3 text-sm @sm:p-5 @sm:text-base"
                >
                  <IconPinned className="size-9 flex-shrink-0 stroke-[1.5] @sm:size-16" />
                  <p className="sr-only"> {card.address}</p>
                </Link>
              )}
            </div>
          </section>
        ) : null}

        {card.links && card.links.length > 0 && (
          <section className="space-y-3 px-4 @sm:space-y-4 @sm:px-8">
            <h2 className="sr-only">Links</h2>
            <div className="grid grid-cols-3 gap-4">
              {card.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-3 text-sm @sm:p-5 @sm:text-base"
                >
                  <div className="relative size-9 flex-shrink-0 @sm:size-16">
                    <Image src={link.icon} fill alt="" sizes="10vw" />
                  </div>
                  <h5 className="sr-only">{link.label}</h5>
                </Link>
              ))}
              {card.attachmentUrl && card.attachmentFileName && (
                <Link
                  href={card.attachmentUrl}
                  download
                  className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-5 text-sm @sm:text-base"
                >
                  <Icons.pdf className="relative size-16 flex-shrink-0" />

                  <h5 className="sr-only">
                    {removeExtension(card.attachmentFileName)}
                  </h5>
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
