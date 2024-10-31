import { z } from "zod";

export const cardSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(2, { message: "Please enter full name" })
    .max(100, { message: "Seriously this much long?" }),
  email: z.string().email().optional(),
  phone: z
    .string({ message: "Invalid Phone number" })
    .min(6, { message: "Invalid Phone number" })
    .max(15)
    .optional(),
  address: z.string().min(6, { message: "Please enter address" }).optional(),
  bio: z.string().optional(),

  companyId: z.number(),
  designation: z.string().optional(),

  image: z.string().optional(),
  cover: z.string().optional(),

  slug: z.string().optional(),

  links: z
    .array(
      z.object({
        id: z.string().optional(),
        label: z
          .string()
          .min(1, { message: "Please enter title for the link" }),
        url: z.string().url({ message: "Please enter a valid URL." }),
        icon: z.string(),
        category: z.string().optional(),
      })
    )
    .optional(),

  attachments: z.string().optional(),
});
