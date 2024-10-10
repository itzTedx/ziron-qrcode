import { z } from "zod";

export const cardSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter full name" })
    .max(100, { message: "Seriously this much long?" }),
  email: z.string().email().optional(),
  phone: z.string().min(6).max(15),
  address: z.string().min(6, { message: "Please enter address" }),
  bio: z.string(),

  companyId: z.number(),
  designation: z.string().optional(),

  image: z.string().optional(),
  cover: z.string().optional(),

  slug: z.string().optional(),

  links: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),

  attachments: z.string().optional(),
});
