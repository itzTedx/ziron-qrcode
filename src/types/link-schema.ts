import { z } from "zod";

export const linkSchema = z.object({
  title: z.string().min(1).max(50),
  url: z.string().url(),
  icon: z.string(),
});
