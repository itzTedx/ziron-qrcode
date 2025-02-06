"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

import { companySchema } from "@/types/company-schema";

import { db } from "../db";
import { companies } from "../schema";

const action = createSafeActionClient();

export const createCompany = action
  .schema(companySchema)
  .action(
    async ({ parsedInput: { name, phone, website, address, logo, id } }) => {
      const formattedUrl = website
        ? new URL(website.startsWith("http") ? website : `https://${website}`)
            .href
        : "";
      try {
        if (!id) {
          const newCompany = await db
            .insert(companies)
            .values({
              name,
              phone,
              website: formattedUrl,
              address,
              logo,
            })
            .returning();

          revalidatePath("/");

          return {
            success: `Company: (${newCompany[0].name}) has been created`,
          };
        } else {
          const editedCompany = await db
            .update(companies)
            .set({
              name,
              phone,
              website: formattedUrl,
              address,
              logo,
            })
            .where(eq(companies.id, id))
            .returning();

          revalidatePath("/");

          return {
            success: `Company: (${editedCompany[0].name}) has been created`,
          };
        }
      } catch (err) {
        return { error: JSON.stringify(err) };
      }
    }
  );
