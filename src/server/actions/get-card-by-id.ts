"use server";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { persons } from "../schema";

export async function getCardById(id: number) {
  try {
    const card = await db.query.persons.findFirst({
      where: eq(persons.id, id),
      with: {
        company: true,
      },
    });

    if (!card) throw new Error("Card not found");

    return { card };
  } catch (error) {
    return { error: "Failed to get company details" };
  }
}
