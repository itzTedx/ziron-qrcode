"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

import { slugify } from "@/lib/utils";
import { cardSchema } from "@/types/card-schema";

import { db } from "../db";
import { links, persons } from "../schema";

const action = createSafeActionClient();

// Helper function to generate a unique slug
async function generateUniqueSlug(name: string) {
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

export const createCard = action
  .schema(cardSchema)
  .action(
    async ({
      parsedInput: {
        id,
        name,
        phone,
        email,
        address,
        companyId,
        designation,
        bio,
        image,
        cover,
        links: linksData,
      },
    }) => {
      try {
        const uniqueSlug = await generateUniqueSlug(name);

        if (id) {
          console.log("existing card");
        }

        if (!id) {
          const newCard = await db
            .insert(persons)
            .values({
              name,
              email,
              phone,
              address,
              bio,

              companyId,
              designation,

              image:
                image ||
                `https://ui-avatars.com/api/?background=random&name=${name}&size=128`,
              cover: cover || "/images/placeholder-cover.jpg",

              slug: uniqueSlug,
            })
            .returning();

          if (linksData) {
            await db.insert(links).values(
              linksData.map((link, i) => ({
                id: link.id ? parseInt(link.id) : undefined,
                icon: link.icon,
                label: link.label,
                url: link.url,
                personId: newCard[0].id,
                order: i,
              }))
            );
          }
          revalidatePath("/");
          return {
            success: `Digital Card: (${newCard[0].name}) has been created`,
            company: newCard[0].companyId,
          };
        }
      } catch (err) {
        return { error: JSON.stringify(err) };
      }
    }
  );
