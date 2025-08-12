import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';

import { Message, MessageSchema } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessageGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
