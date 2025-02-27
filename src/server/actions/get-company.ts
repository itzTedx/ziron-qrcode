"use server";

import { unstable_cache } from "next/cache";

import { db } from "../db";

export async function getCompanies() {
  try {
    const data = await unstable_cache(
      async () => {
        return db.query.companies.findMany({ with: { persons: true } });
      },
      ["companies-cache"],
      {
        revalidate: 60, // Cache for 60 seconds
        tags: ["companies"],
      }
    )();

    return { companies: data };
  } catch (error) {
    return { error: `Failed to get company details${error}` };
  }
}
