"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import { db } from "../db";
import { emails, links, persons, phones } from "../schema";

const action = createSafeActionClient();

export const deleteCard = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    console.log("Received id:", id);

    try {
      await db.delete(persons).where(eq(persons.id, id));
      console.log("Card Deleted: ", id);
      await db.delete(links).where(eq(links.personId, id));
      console.log("Links deleted: ", id);
      await db.delete(phones).where(eq(phones.id, id));
      console.log("Phones deleted: ", id);
      await db.delete(emails).where(eq(emails.id, id));
      console.log("Emails deleted: ", id);
      revalidatePath("/");
      console.log("Revalidating Path");

      return { success: `Card deleted successfully` };
    } catch (error) {
      console.log("DELETE_CARD:", error);
      return { error: `Failed to delete Card: ${error}` };
    }
  });
