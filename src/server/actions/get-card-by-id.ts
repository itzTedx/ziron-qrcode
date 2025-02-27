"use server";

import { unstable_cache } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { persons } from "../schema";

export const getCardById = unstable_cache(
  async (id: string) => {
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
  },
  ["person-by-id"],
  {
    revalidate: 3600,
    tags: ["persons"],
  }
);
