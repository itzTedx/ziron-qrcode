"use server";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { persons } from "../schema";

export async function getCardBySlug(slug: string) {
  try {
    const card = await db.query.persons.findFirst({
      where: eq(persons.slug, slug),
      with: {
        company: true,
      },
    });

    if (!card) throw new Error("Card not found");

    return { card };
  } catch (error) {
    return { error: `Failed to get company details${error}` };
  }
}
