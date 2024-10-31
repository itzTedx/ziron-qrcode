import { eq } from "drizzle-orm";

import { slugify } from "@/lib/utils";
import { db } from "@/server/db";
import { persons } from "@/server/schema";

// Helper function to generate a unique slug
export async function generateUniqueSlug(name: string) {
  let slug = slugify(name);
  let exists = await db
    .select()
    .from(persons)
    .where(eq(persons.slug, slug))
    .limit(1);

  let counter = 1;
  while (exists.length > 0) {
    // Append a number to the slug if it already exists
    slug = `${slugify(name)}-${counter}`;
    exists = await db
      .select()
      .from(persons)
      .where(eq(persons.slug, slug))
      .limit(1);
    counter++;
  }

  return slug;
}
