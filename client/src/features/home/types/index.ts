import { z } from "zod";

import { RoomSchema, RoomResponseSchema } from "../schemas";

export type Room = z.infer<typeof RoomSchema>;

export type RoomResponse = z.infer<typeof RoomResponseSchema>;
