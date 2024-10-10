"use server";

import { db } from "../db";

export async function getCompanies() {
  try {
    const companies = await db.query.companies.findMany({
      with: {
        persons: true,
      },
    });

    if (!companies) throw new Error("Company not found");

    return { companies };
  } catch (error) {
    return { error: "Failed to get company details" };
  }
}