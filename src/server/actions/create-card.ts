"use server";

import { revalidatePath } from "next/cache";

import { createSafeActionClient } from "next-safe-action";

import { slugify } from "@/lib/utils";
import { cardSchema } from "@/types/card-schema";

import { db } from "../db";
import { persons } from "../schema";

const action = createSafeActionClient();

export const createCard = action
  .schema(cardSchema)
  .action(
    async ({
      parsedInput: {
        name,
        phone,
        email,
        address,
        companyId,
        designation,
        bio,
        image,
        cover,
      },
    }) => {
      try {
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
              `https://ui-avatars.com/api/?background=random&name=${name}`,
            cover: cover || "/images/placeholder-cover.jpg",

            slug: slugify(name),
          })
          .returning();
        revalidatePath("/");
        return {
          success: `Digital Card: (${newCard[0].name}) has been created`,
        };
      } catch (err) {
        return { error: JSON.stringify(err) };
      }
    }
  );
