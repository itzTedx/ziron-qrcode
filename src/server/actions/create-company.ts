"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

import { formatWebsiteUrl } from "@/lib/utils";
import { companySchema } from "@/types/company-schema";

import { db } from "../db";
import { companies } from "../schema";

const action = createSafeActionClient();

export const createCompany = action
  .schema(companySchema)
  .action(
    async ({ parsedInput: { name, phone, website, address, logo, id } }) => {
      try {
        const formattedUrl = formatWebsiteUrl(website);
        const companyData = {
          name,
          phone,
          website: formattedUrl,
          address,
          logo,
        };

        const [result] = id
          ? await db
              .update(companies)
              .set(companyData)
              .where(eq(companies.id, id))
              .returning()
          : await db.insert(companies).values(companyData).returning();

        if (!result) {
          return { error: "Failed to save company data" };
        }

        revalidatePath("/");
        revalidateTag("companies");

        return {
          success: `Company: (${result.name}) has been ${id ? "updated" : "created"}`,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        return { error: errorMessage };
      }
    }
  );
