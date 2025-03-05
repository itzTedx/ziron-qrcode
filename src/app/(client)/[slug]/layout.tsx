import { ReactNode } from "react";

import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { persons } from "@/server/schema";

import { Providers } from "./providers";

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const person = await db.query.persons.findFirst({
    where: eq(persons.slug, params.slug),
    columns: { isDarkMode: true },
  });
  return (
    <>
      {children}
      <Providers isDarkMode={person?.isDarkMode} />
    </>
  );
}
