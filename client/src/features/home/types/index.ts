import { z } from "zod";

import { RoomSchema, RoomResponseSchema, RoomRecentSchema } from "../schemas";

export type Room = z.infer<typeof RoomSchema>;

export type RoomResponse = z.infer<typeof RoomResponseSchema>;

export type RoomRecent = z.infer<typeof RoomRecentSchema>;
