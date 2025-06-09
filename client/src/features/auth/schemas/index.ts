import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  color: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
