import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  color: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
