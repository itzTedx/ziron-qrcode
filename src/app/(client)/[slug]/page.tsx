import { notFound } from "next/navigation";

import CardTemplate from "@/components/features/templates/card-template";
import DefaultTemplate from "@/components/features/templates/default-template";
import ModernTemplate from "@/components/features/templates/modern-template";
import { getCardBySlug } from "@/server/actions/get-card-by-slug";
import { imageToBase64 } from "@/utils/get-image-to-base64";

// export const revalidate = 60;

// export async function generateStaticParams() {
//   const { cards } = await getCards();

//   return cards?.map((card) => ({
//     slug: card.slug,
//   }));
// }

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const { card } = await getCardBySlug(params.slug);

  if (!card) notFound();

  const imageURI = card.image ? await imageToBase64(card.image) : undefined;

  // const template = card.template;

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

  // if (template === "default")
  //   return <DefaultTemplate card={card} imageBase64URI={imageURI} />;

  // return <ModernTemplate card={card} imageBase64URI={imageURI} />;
}
