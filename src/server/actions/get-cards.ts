"use server";

import { unstable_cache as cache } from "next/cache";

import { db } from "../db";

export const getCards = cache(
  async () => {
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
  },
  ["persons-list"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["persons"],
  }
);
