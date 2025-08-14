import { z } from "zod";

import {
  RoomSchema,
  RoomResponseSchema,
  RoomRecentSchema,
  MessageSchema,
  MessageResponseSchema,
} from "../schemas";

export type Room = z.infer<typeof RoomSchema>;

export type RoomResponse = z.infer<typeof RoomResponseSchema>;

export type RoomRecent = z.infer<typeof RoomRecentSchema>;

export type Message = z.infer<typeof MessageSchema>;

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

export type UserStatus = {
  userId: string;
  status: string;
};
