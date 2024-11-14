import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";

import DefaultTemplate from "@/components/features/templates/default-template";
import ModernTemplate from "@/components/features/templates/modern-template";
import { getCardBySlug } from "@/server/actions/get-card-by-slug";
import { getCards } from "@/server/actions/get-cards";
import { imageToBase64 } from "@/utils/get-image-to-base64";

// export const revalidate = 60;

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

  revalidateTag(`card-${params.slug}`);

  const template = card.template;

  if (template === "default")
    return <DefaultTemplate card={card} imageBase64URI={imageURI} />;

  return <ModernTemplate card={card} imageBase64URI={imageURI} />;
}
