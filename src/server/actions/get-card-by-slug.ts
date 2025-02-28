"use server";

import { unstable_cache as cache } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { persons } from "../schema";

export const getCardBySlug = cache(
  async (slug: string) => {
    try {
      const card = await db.query.persons.findFirst({
        where: eq(persons.slug, slug),
        with: {
          company: true,
          phones: true,
          emails: true,
          links: true,
        },
      });

      if (!card) throw new Error("Card not found");

      return { card };
    } catch (error) {
      return { error: `Failed to get company details${error}` };
    }
  },
  ["person-by-slug"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["persons"],
  }
);
