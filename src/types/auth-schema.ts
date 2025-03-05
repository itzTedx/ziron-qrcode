import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
});
