"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import { db } from "../db";
import { companies } from "../schema";

type DeleteCompanyResult = {
  success?: string;
  error?: string;
};

const action = createSafeActionClient();

export const deleteCompany = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }): Promise<DeleteCompanyResult> => {
    try {
      // Check if company exists first
      const existing = await db
        .select()
        .from(companies)
        .where(eq(companies.id, id))
        .limit(1);

      if (!existing.length) {
        return { error: `Company with ID ${id} not found` };
      }

      const [deleted] = await db
        .delete(companies)
        .where(eq(companies.id, id))
        .returning();

      revalidatePath("/");

      return { success: `Company "${deleted.name}" has been deleted` };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return {
        error: "An unexpected error occurred while deleting the company",
      };
    }
  });
