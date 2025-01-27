"use server";

import { createSafeActionClient } from "next-safe-action";

import { companySchema } from "@/types/company-schema";

import { db } from "../db";
import { companies } from "../schema";

const action = createSafeActionClient();

export const createCompany = action
  .schema(companySchema)
  .action(async ({ parsedInput: { name, phone, website, address, logo } }) => {
    const formattedUrl = website
      ? new URL(website.startsWith("http") ? website : `https://${website}`)
          .href
      : "";
    try {
      const newCategory = await db
        .insert(companies)
        .values({
          name,
          phone,
          website: formattedUrl,
          address,
          logo,
        })
        .returning();

      // revalidatePath('/studio/categories')

      return {
        success: `Company: (${newCategory[0].name}) has been created`,
      };
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  });
