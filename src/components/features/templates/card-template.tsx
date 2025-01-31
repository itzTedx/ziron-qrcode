import Image from "next/image";
import Link from "next/link";

import {
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconPinned,
} from "@tabler/icons-react";

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

export default function CardTemplate({
  card,
  company,
  imageBase64URI,
}: TemplateProps) {
  if (!card) return null;

  const companyData = company?.find((c) => c.id === card.companyId);

  const textColor = getTextColorByBackground(card.theme || "#4938ff");
  const btnTextColor = getTextColorByBackground(card.btnColor || "#4938ff");

  const theme = card.theme || "#4938ff";
  const btnColor = card.btnColor || "#4938ff";

  return (
    <div className="relative flex h-full w-full flex-col justify-between @sm:max-h-[700px]">
      <div className="no-scrollbar pb-6">
        <header className="w-full">
          <div className="relative w-full">
            <div className="relative h-40">
              <Image
                src={card.cover ? card.cover : "/images/placeholder-cover.jpg"}
                alt={`${card.name}'s cover`}
                className="object-cover"
                sizes="100vw"
                fill
              />
            </div>

            <section
              className="absolute inset-x-4 top-16 z-10 rounded-md border border-background px-4 py-4 @sm:inset-x-6 @sm:px-6"
              style={{
                backgroundColor: theme,
                color: textColor,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  {card.name && (
                    <h1 className="text-xl font-bold @sm:text-2xl">
                      {card.name}
                    </h1>
                  )}
                  {card.designation && (
                    <h2 className="text-xs @sm:text-sm">{card.designation}</h2>
                  )}
                </div>
                {card.image && (
                  <div className="relative size-16 overflow-hidden rounded-full border-4 border-background bg-gray-100 @sm:size-24">
                    <Image
                      src={card.image}
                      fill
                      alt=""
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="mt-3 space-y-1.5">
                  {card.emails &&
                    card.emails.map((email, i) => (
                      <Link
                        key={`${i + 1}-${email.email}`}
                        href={`mailto:${email.email}`}
                        className="flex items-center gap-2 text-xs @sm:text-base"
                      >
                        <IconMail className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                        {email.email}
                      </Link>
                    ))}
                  {card.phones &&
                    card.phones.map((phone, i) => (
                      <Link
                        key={`${i + 1}-${phone.phone}`}
                        href={`tel:${phone.phone}`}
                        className="flex items-center gap-2 text-xs @sm:text-base"
                      >
                        <IconPhone className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                        {phone.phone}
                      </Link>
                    ))}
                </div>
                {card.company && card.company.logo && (
                  <Image
                    src={card.company.logo}
                    height={100}
                    width={80}
                    alt="cover"
                    className="z-30 h-5 object-contain"
                  />
                )}
              </div>
            </section>
          </div>
          <section
            className={cn(
              "mt-12 flex flex-col items-center gap-y-3 px-6 py-4 @sm:mt-24"
            )}
          >
            {card.links && card.links.length > 0 && (
              <div className="flex gap-2 @sm:gap-4">
                {card.links.map((link, index) => (
                  <LinkBox
                    color={theme}
                    key={`${index}-${link.label}-${link.url}`}
                    href={link.url || "#"}
                  >
                    <div className="relative size-7 flex-shrink-0 @sm:size-9">
                      <Image src={link.icon} fill alt="" sizes="10vw" />
                    </div>
                    <h5 className="sr-only">{link.label}</h5>
                  </LinkBox>
                ))}
              </div>
            )}

            <div className="w-full">
              <SaveContactButton
                data={card}
                imageBase64={imageBase64URI}
                style={{
                  backgroundColor: btnColor,
                  color: btnTextColor,
                }}
              />
            </div>
            {card.bio && (
              <p className="w-full text-balance text-[10px] @sm:text-xs">
                {card.bio}
              </p>
            )}
          </section>
        </header>

        {card.company || card.emails || card.phones || card.address ? (
          <section className="px-4 py-3 @sm:px-6 @sm:py-4">
            <h2 className="pb-3 text-xs font-medium text-gray-600 @sm:text-sm">
              Contact Info
            </h2>

            <div className="space-y-3 @sm:space-y-4">
              {card.company || companyData ? (
                <Link
                  href={
                    card.company && card.company.website
                      ? card.company.website
                      : "#"
                  }
                  target="_blank"
                  className="flex items-center gap-2 text-sm @sm:text-base"
                >
                  <IconBuildingSkyscraper className="size-4 flex-shrink-0 stroke-[1.5] @sm:size-5" />
                  {companyData?.name || card.company?.name}
                </Link>
              ) : null}

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

        {card.attachmentUrl && card.attachmentFileName && (
          <section className="space-y-3 px-4 @sm:space-y-4 @sm:px-6">
            <h2 className="pt-3 text-sm font-medium text-gray-600">
              Attachment
            </h2>
            <div className="space-y-4">
              <Link
                href={card.attachmentUrl}
                download
                className="flex items-center gap-2 rounded-md border p-3 text-sm @sm:text-base"
                style={{
                  borderColor: btnColor,
                  color: btnColor,
                }}
              >
                <h5 className="font-semibold">
                  {removeExtension(card.attachmentFileName)}
                </h5>
              </Link>
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
      target="_blank"
      className="flex size-10 items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 text-sm @sm:size-14 @sm:text-base"
      style={{ borderColor: color, backgroundColor: `${color}10` }}
    >
      {children}
    </Link>
  );
};
