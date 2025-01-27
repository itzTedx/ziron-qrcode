import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter company name" })
    .max(100, { message: "Company name too long" }),
  phone: z.string().min(6).max(20),
  website: z.string().optional(),
  address: z.string().min(6, { message: "Please enter address" }),
  logo: z.string().min(1, { message: "Logo is required" }),
});
