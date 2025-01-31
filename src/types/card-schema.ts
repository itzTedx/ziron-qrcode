import { z } from "zod";

export const cardSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(2, { message: "Please enter full name" })
    .max(256, { message: "Seriously this much long?" }),
  phones: z
    .array(
      z.object({
        id: z.string().optional(),
        phone: z
          .string({ message: "Invalid Phone number" })
          .min(6, { message: "Invalid Phone number" })
          .max(20)
          .optional(),
        label: z.string().default("primary"),
      })
    )
    .optional(),
  emails: z
    .array(
      z.object({
        id: z.string().optional(),
        email: z.string().email().optional(),
        label: z.string().default("primary"),
      })
    )
    .optional(),

  address: z.string().min(6, { message: "Please enter address" }).optional(),
  mapUrl: z
    .string()
    .min(6, { message: "Please copy link from map" })
    .optional(),
  bio: z.string().optional(),

  companyId: z.number(),
  designation: z.string().optional(),

  attachmentUrl: z.string().optional().nullish(),
  attachmentFileName: z.string().optional().nullish(),

  image: z.string().optional(),
  cover: z.string().optional(),

  slug: z.string().optional(),

  links: z
    .array(
      z.object({
        id: z.number().optional(),
        label: z
          .string()
          .min(1, { message: "Please enter title for the link" }),
        url: z.string().url({ message: "Please enter a valid URL." }),
        icon: z.string(),
        category: z.string().optional(),
      })
    )
    .optional(),

  template: z.string().optional().default("default"),
  theme: z.string().optional().default("#4938ff"),
  btnColor: z.string().optional().default("#4938ff"),
});

export type zCardSchema = z.infer<typeof cardSchema>;
