"use server";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { persons } from "../schema";

export async function getCardById(id: string) {
  try {
    const card = await db.query.persons.findFirst({
      where: eq(persons.id, parseInt(id)),
      with: {
        company: true,
        links: true,
        phones: true,
        emails: true,
      },
    });

    if (!card) throw new Error("Card not found");

    return { card };
  } catch (error) {
    return { error: `Failed to get company details${error}` };
  }
}
