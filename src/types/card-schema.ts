import { z } from "zod";

export const cardSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(2, { message: "Please enter full name" })
    .max(100, { message: "Seriously this much long?" }),
  phones: z
    .array(
      z.object({
        id: z.string().optional(),
        phone: z
          .string({ message: "Invalid Phone number" })
          .min(6, { message: "Invalid Phone number" })
          .max(20)
          .optional(),
      })
    )
    .optional(),
  emails: z
    .array(
      z.object({
        id: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .optional(),

  address: z.string().min(6, { message: "Please enter address" }).optional(),
  bio: z.string().optional(),

  companyId: z.number(),
  designation: z.string().optional(),

  attachmentUrl: z.string().optional(),
  attachmentFileName: z.string().optional(),

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
});

export type zCardSchema = z.infer<typeof cardSchema>;
