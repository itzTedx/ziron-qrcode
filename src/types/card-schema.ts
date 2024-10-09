import { z } from "zod";

export const cardSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  company: z.string(),
  designation: z.string().min(2),
  bio: z.string(),
  links: z.array(z.string()),
  template: z.string(),
});
