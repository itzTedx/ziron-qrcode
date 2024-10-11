"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import { db } from "../db";
import { companies } from "../schema";

const action = createSafeActionClient();

export const deleteCompany = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(companies)
        .where(eq(companies.id, id))
        .returning();

      revalidatePath("/");

      return { success: `Company (${data[0].name}) has been deleted` };
    } catch (error) {
      return { error: `Failed to delete company: ${error}` };
    }
  });
