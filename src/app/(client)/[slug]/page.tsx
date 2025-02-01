import { notFound } from "next/navigation";

import CardTemplate from "@/components/features/templates/card-template";
import DefaultTemplate from "@/components/features/templates/default-template";
import ModernTemplate from "@/components/features/templates/modern-template";
import { getCardBySlug } from "@/server/actions/get-card-by-slug";
import { getCards } from "@/server/actions/get-cards";
import { imageToBase64 } from "@/utils/get-image-to-base64";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { cards } = await getCards();

  return cards?.map((card) => ({
    slug: card.slug,
  }));
}

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const { card } = await getCardBySlug(params.slug);
  if (!card) notFound();

  const imageURI = card.image ? await imageToBase64(card.image) : undefined;

  switch (card.template) {
    case "default":
      return <DefaultTemplate card={card} imageBase64URI={imageURI} />;
    case "modern":
      return <ModernTemplate card={card} imageBase64URI={imageURI} />;
    case "card":
      return <CardTemplate card={card} imageBase64URI={imageURI} />;
    default:
      return <DefaultTemplate card={card} imageBase64URI={imageURI} />;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { card } = await getCardBySlug(params.slug);
  if (!card) return;

  const data = {
    title: `${card.name} - ${card.company.name} | Digital Card`,
    description: card.bio,
    icon: card.company.logo ?? undefined,
    twitterHandler: card.links
      .find((l) => l.label === "Twitter")
      ?.url?.replace(/.*\.com\//, "@"),
  };

  return {
    title: data.title,
    description: data.description,
    applicationName: data.title,
    icons: {
      icon: data.icon,
    },

    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      creator: data.twitterHandler,
    },
  };
}

export async function generateViewport({
  params,
}: {
  params: { slug: string };
}) {
  const { card } = await getCardBySlug(params.slug);
  if (!card) return;

  return {
    colorScheme: "light",
    themeColor: card.theme,
  };
}
