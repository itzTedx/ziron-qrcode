"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

import { cardSchema } from "@/types/card-schema";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";

import { db } from "../db";
import { links, persons } from "../schema";

const action = createSafeActionClient();

export const createCard = action.schema(cardSchema).action(
  async ({
    parsedInput: {
      id,
      name,
      phone,
      email,
      address,
      companyId,
      designation,
      // attachments: attachment,
      bio,
      image,
      cover,
      links: linksData,
    },
  }) => {
    try {
      const uniqueSlug = await generateUniqueSlug(name);

      if (id) {
        const currentCard = await db.query.persons.findFirst({
          where: eq(persons.id, id),
        });
        if (!currentCard) return { error: "Card not found" };

        const editedCard = await db
          .update(persons)
          .set({
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
          .where(eq(persons.id, id))
          .returning();

        console.log(
          `Updated Exiting Card; Proceed to delete Links attached to the card${editedCard[0].name}`
        );

        //Delete Existing Links and update with new one
        await db.delete(links).where(eq(links.personId, editedCard[0].id));
        console.log("Deleted Existing links; Proceed to add new links");
        if (linksData) {
          await db.insert(links).values(
            linksData.map((link, i) => ({
              icon: link.icon,
              label: link.label,
              url: link.url,
              personId: editedCard[0].id,
              order: i,
            }))
          );
        }

        revalidatePath("/");
        return {
          success: `Digital Card: (${editedCard[0].name}) has been Edited`,
          company: editedCard[0].companyId,
        };
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
