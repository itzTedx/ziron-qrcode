"use server";

import { db } from "../db";

export async function getCompanies() {
  try {
    // const data = await db
    //   .select()
    //   .from(companies)
    //   .leftJoin(persons, eq(companies.id, persons.companyId));
    const data = await db.query.companies.findMany({ with: { persons: true } });

    return { companies: data };
  } catch (error) {
    return { error: `Failed to get company details${error}` };
  }
}
