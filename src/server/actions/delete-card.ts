"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import { db } from "../db";
import { links, persons } from "../schema";

const action = createSafeActionClient();

export const deleteCard = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(persons)
        .where(eq(persons.id, id))
        .returning();

      await db.delete(links).where(eq(links.personId, id));

      revalidatePath("/");

      return { success: `Card (${data[0].name}) has been deleted` };
    } catch (error) {
      return { error: `Failed to delete Card: ${error}` };
    }
  });
