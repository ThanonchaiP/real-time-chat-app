import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: 'direct' | 'group';

  @Prop({ required: true })
  participants: Array<string>;

  @Prop({ required: true })
  createdBy: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
