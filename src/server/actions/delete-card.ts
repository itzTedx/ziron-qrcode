"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import { db } from "../db";
import { emails, links, persons, phones } from "../schema";

const action = createSafeActionClient();

const DeleteCardSchema = z.object({
  id: z.number().positive(),
});

export const deleteCard = action
  .schema(DeleteCardSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      // Perform all deletions in parallel
      const [user] = await Promise.all([
        db
          .delete(persons)
          .where(eq(persons.id, id))
          .returning({ name: persons.name }),

        db.delete(links).where(eq(links.personId, id)),
        db.delete(phones).where(eq(phones.personId, id)),
        db.delete(emails).where(eq(emails.personId, id)),
      ]);

      if (!user || user.length === 0) {
        throw new Error("Card not found");
      }

      revalidatePath("/");
      return { success: `${user[0].name} - Card deleted successfully` };
    } catch (error) {
      console.error("Failed to delete card:", { id, error });
      return {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while deleting the card",
      };
    }
  });
