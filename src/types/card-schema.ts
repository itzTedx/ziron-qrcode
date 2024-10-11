import { z } from "zod";

export const cardSchema = z.object({
  id: z.string().optional(),
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
        id: z.string().optional(),
        label: z.string().url({ message: "Please enter a valid URL." }),
        href: z.string().url(),
        icon: z.object({}),
      })
    )
    .optional(),

  attachments: z.string().optional(),
});
