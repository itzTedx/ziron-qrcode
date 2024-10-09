"use server";

import { db } from "../db";

export async function getCards() {
  try {
    const cards = await db.query.persons.findMany({
      with: {
        company: true,
      },
    });

    if (!cards) throw new Error("Company not found");

    return { cards };
  } catch (error) {
    return { error: "Failed to get company details" };
  }
}
