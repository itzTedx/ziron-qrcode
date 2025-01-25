import Image from "next/image";
import Link from "next/link";

import { IconMail, IconPhone, IconPinned } from "@tabler/icons-react";

import { Icons } from "@/components/assets/icons";
import SaveContactButton from "@/components/save-contact-button";
import getTextColorByBackground from "@/lib/get-brightness-by-color";
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

  const textColor = getTextColorByBackground(card.btnColor);
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
                  height={218}
                  width={445}
                  alt="cover"
                  className="h-full w-full object-cover"
                />
              )}
            </section>
            {card.image && (
              <div
                className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 bg-gray-100 @sm:size-32"
                style={{ borderColor: card.theme }}
              >
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
              <h2
                className="font-medium"
                style={{
                  color: card.theme,
                }}
              >
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
            {card.phones && (
              <Link
                href={`tel:${card.phones[0].phone}`}
                className="flex h-10 w-full items-center justify-center rounded-full border-2 border-primary px-6 text-center font-semibold text-primary @sm:h-12"
                style={{
                  color: card.theme,
                  borderColor: card.theme,
                }}
              >
                Call me now!
              </Link>
            )}

            <SaveContactButton
              data={card}
              imageBase64={imageBase64URI}
              style={{
                backgroundColor: card.btnColor,
                color: textColor,
              }}
              className="h-10 rounded-full @sm:h-12"
            />
          </section>
        </header>

        {card.company || card.emails || card.phones || card.address ? (
          <section className="space-y-3 px-4 @sm:space-y-4 @sm:px-8">
            <h2 className="sr-only">Contact Info</h2>

            <div className="grid grid-cols-3 gap-4">
              {card.emails &&
                card.emails.map((e, i) => (
                  <LinkBox
                    color={card.theme}
                    key={`${e.id}-${i}-${e.email}`}
                    href={`mailto:${e.email}`}
                  >
                    <IconMail className="size-9 flex-shrink-0 stroke-[1.5] @sm:size-16" />
                    <p className="sr-only">{e.email}</p>
                  </LinkBox>
                ))}
              {card.phones &&
                card.phones.map((ph, i) => (
                  <LinkBox
                    color={card.theme}
                    key={`${ph.id}-${i}-${ph.phone}`}
                    href={`tel:${ph.phone}`}
                  >
                    <IconPhone className="size-9 flex-shrink-0 stroke-[1.5] @sm:size-16" />
                    <p className="sr-only"> {ph.phone}</p>
                  </LinkBox>
                ))}
              {card.address && (
                <LinkBox color={card.theme} href={`#`}>
                  <IconPinned className="size-9 flex-shrink-0 stroke-[1.5] @sm:size-16" />
                  <p className="sr-only"> {card.address}</p>
                </LinkBox>
              )}
            </div>
          </section>
        ) : null}

        {card.links && card.links.length > 0 && (
          <section className="space-y-3 px-4 pb-8 @sm:space-y-4 @sm:px-8">
            <h2 className="sr-only">Links</h2>
            <div className="grid grid-cols-3 gap-4">
              {card.links.map((link, index) => (
                <LinkBox
                  color={card.theme}
                  key={`${index}-${link.label}-${link.url}`}
                  href={link.url || "#"}
                >
                  <div className="relative size-9 flex-shrink-0 @sm:size-16">
                    <Image src={link.icon} fill alt="" sizes="10vw" />
                  </div>
                  <h5 className="sr-only">{link.label}</h5>
                </LinkBox>
              ))}
              {card.attachmentUrl && card.attachmentFileName && (
                <LinkBox color={card.theme} href={card.attachmentUrl} download>
                  <Icons.pdf className="relative size-9 flex-shrink-0 @sm:size-16" />

                  <h5 className="sr-only">
                    {removeExtension(card.attachmentFileName)}
                  </h5>
                </LinkBox>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const LinkBox = ({
  href,
  download,
  color,
  children,
}: {
  href: string;
  download?: boolean;
  color: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      download={download}
      className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-5 text-sm @sm:text-base"
      style={{ borderColor: color, backgroundColor: `${color}10` }}
    >
      {children}
    </Link>
  );
};
