import { ResponseSchema } from "@/schemas";
import { z } from "zod";

export const RoomSchema = z.object({
  _id: z.string(),
  name: z.string(),
  type: z.string(),
  participants: z.array(z.string()),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RoomResponseSchema = ResponseSchema.extend({
  data: z.array(RoomSchema),
});
