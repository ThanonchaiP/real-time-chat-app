import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Attachment {
  @Prop({ required: true, enum: ['image', 'video', 'audio', 'file'] })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop()
  name?: string;

  @Prop()
  size?: number;

  @Prop()
  mimeType?: string;
}

@Schema()
export class ReplyTo {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  messageId: MongooseSchema.Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  senderId: MongooseSchema.Types.ObjectId;
}

@Schema()
export class ReadReceipt {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  readAt: Date;
}

@Schema()
export class Reaction {
  @Prop({ required: true })
  emoji: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true,
  })
  roomId: MongooseSchema.Types.ObjectId | Room;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['text', 'rich_text', 'markdown'], default: 'text' })
  contentType: string;

  @Prop({ type: ReplyTo })
  replyTo?: ReplyTo;

  @Prop({ type: [Attachment] })
  attachments?: Attachment[];

  @Prop({ enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' })
  status: string;

  @Prop({ type: [ReadReceipt], default: [] })
  readBy: ReadReceipt[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ type: [Reaction], default: [] })
  reactions: Reaction[];

  @Prop()
  deletedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Add indexes
MessageSchema.index({ roomId: 1, createdAt: -1 });
MessageSchema.index({ content: 'text' });
