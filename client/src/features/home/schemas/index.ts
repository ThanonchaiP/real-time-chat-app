import { ResponseSchema } from "@/schemas";
import { z } from "zod";

export const RoomSchema = z.object({
  _id: z.string(),
  name: z.string(),
  type: z.string(),
  participants: z.array(z.string()),
  createdBy: z.string(),
  createdAt: z.string(),
  color: z.string().optional(),
  updatedAt: z.string(),
});

export const RoomResponseSchema = ResponseSchema.extend({
  data: z.array(RoomSchema),
});

export const RoomRecentSchema = RoomSchema.extend({
  lastMessage: z.object({
    content: z.string(),
    contentType: z.string(),
    createdAt: z.string(),
  }),
  chatWithId: z.string().optional(),
});

export const MessageSchema = z.object({
  _id: z.string(),
  roomId: z.string(),
  senderId: z.string(),
  content: z.string(),
  contentType: z.string(),
  attachments: z.array(z.unknown()),
  status: z.string(),
  isEdited: z.boolean(),
  readBy: z.array(z.unknown()),
  reactions: z.array(z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MessageResponseSchema = ResponseSchema.extend({
  data: z.array(MessageSchema),
});
