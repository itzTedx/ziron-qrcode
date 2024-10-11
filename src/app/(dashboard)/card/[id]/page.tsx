import { getCardById } from "@/server/actions/get-card-by-id";
import { getCompanies } from "@/server/actions/get-company";

import CardCustomizeForm from "./_components/card-form";

interface CardProps {
  params: { id: string };
}

export default async function CardPage({ params }: CardProps) {
  const { companies } = await getCompanies();

  // Fetching the card based on the ID
  const { card } = await getCardById(params.id);

  // Check if companies exist before rendering
  if (!companies) return null;

  // If the card doesn't exist, treat it as a new card
  const isEditMode = !!card; // If card exists, it is in edit mode

  return (
    <CardCustomizeForm
      data={companies}
      isEditMode={isEditMode}
      initialData={card}
    />
  );
}
