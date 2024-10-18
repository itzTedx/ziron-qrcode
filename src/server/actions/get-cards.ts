"use server";

import { db } from "../db";

export async function getCards() {
  try {
    const cards = await db.query.persons.findMany({
      with: {
        company: true,
        links: true,
      },
    });

    if (!cards) throw new Error("Card not found");

    return { cards };
  } catch (error) {
    return { error: `Failed to get card details${error}` };
  }
}
