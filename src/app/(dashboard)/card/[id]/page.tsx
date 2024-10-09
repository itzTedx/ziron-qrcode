import { getCardById } from "@/server/actions/get-card-by-id";
import { getCompanies } from "@/server/actions/get-company";

import CardCustomizeForm from "./_components/card-customize-form";

interface CardProps {
  params: { id: string };
}

export default async function CardPage({ params }: CardProps) {
  const { companies } = await getCompanies();
  const { card } = await getCardById(parseInt(params.id));

  const isNew = params.id === "new";

  if (!companies) return null;

  return <CardCustomizeForm data={companies} isNew={isNew} />;
}
