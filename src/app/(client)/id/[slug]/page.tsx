import { notFound } from "next/navigation";

import DefaultTemplate from "@/components/features/templates/default-template";
import { getCardBySlug } from "@/server/actions/get-card-by-slug";

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const { card } = await getCardBySlug(params.slug);

  if (!card) notFound();

  return <DefaultTemplate card={card} />;
}
