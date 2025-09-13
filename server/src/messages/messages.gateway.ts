import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { TokenPayload } from '@/types';
import { UsersService } from '@/users/users.service';
import { parseCookies } from '@/utils';

import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

interface NewMessage extends Message {
  sender: {
    _id: string;
    name: string;
    color: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: [
      'https://chat.14again.life',
      'https://14again.life',
      'http://localhost:3000',
    ],
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    console.log('Socket server initialized');

    server.use((socket, next) => {
      try {
        const cookies = parseCookies(socket.handshake.headers.cookie || '');
        const accessToken = cookies.access_token;

        if (!accessToken) {
          return next(new Error('Authentication token missing'));
        }

        this.jwtService
          .verifyAsync<TokenPayload>(accessToken, {
            secret: process.env.JWT_SECRET,
          })
          .then((payload) => {
            const userId = payload.sub;
            socket.handshake.auth.userId = userId;
            next();
          })
          .catch((error) => {
            console.error('Authentication error:', error);
            next(new Error('Authentication failed'));
          });
      } catch (error: unknown) {
        console.error('Authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  async handleConnection(client: Socket) {
    try {
      // Handle user connection
      const userId = client.handshake.auth.userId as string;
      if (!userId) {
        throw new WsException('User ID not provided');
      }

      // อัพเดท status ใน database
      await this.usersService.updateUserStatus(userId, 'online');

      await client.join(`user:${userId}`);

      // Emit user online status
      this.server.emit('user_status_change', { userId, status: 'online' });

      console.log(`User ${userId} connected`);
    } catch (error: unknown) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId as string;

    if (!userId) {
      throw new WsException('User ID not provided');
    }

    await this.usersService.updateUserStatus(userId, 'offline');
    this.server.emit('user_status_change', { userId, status: 'offline' });
    console.log(`User ${userId} disconnected`);
  }

  @SubscribeMessage('new_message')
  async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      // Verify the sender is the authenticated user
      const userId = client.handshake.auth.userId;
      if (createMessageDto.senderId !== userId) {
        throw new WsException('Unauthorized sender');
      }

      // Create the message
      const [message, user] = await Promise.all([
        this.messagesService.create(createMessageDto),
        this.usersService.findOne(createMessageDto.senderId),
      ]);

      const sender = {
        _id: user._id.toString(),
        name: user.name,
        color: user.color,
      };
      const newMessage = { sender, ...message.toObject() };

      // Broadcast to the room
      this.broadcastNewMessage(createMessageDto.roomId, newMessage);

      return { event: 'message_sent', data: message };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const userId = client.handshake.auth.userId;

    // Broadcast to all users in the room except sender
    client.to(`room:${data.roomId}`).emit('user_typing', {
      userId,
      roomId: data.roomId,
    });
  }

  @SubscribeMessage('typing_end')
  handleTypingEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const userId = client.handshake.auth.userId;

    // Broadcast to all users in the room except sender
    client.to(`room:${data.roomId}`).emit('user_typing_end', {
      userId,
      roomId: data.roomId,
    });
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    await client.join(`room:${data.roomId}`);
    console.log(
      `User ${client.handshake.auth.userId} joined room ${data.roomId}`,
    );
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    await client.leave(`room:${data.roomId}`);
    console.log(
      `User ${client.handshake.auth.userId} left room ${data.roomId}`,
    );
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; roomId: string },
  ) {
    try {
      const userId = client.handshake.auth.userId as string;

      // Update message read receipt
      const updatedMessage = await this.messagesService.markAsRead(
        data.messageId,
        userId,
      );

      // Broadcast to room that message was read
      client.to(`room:${data.roomId}`).emit('message_read', {
        messageId: data.messageId,
        userId,
        readAt: new Date(),
      });

      return { event: 'marked_as_read', data: updatedMessage };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('mark_room_as_read')
  async handleMarkRoomAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      const userId = client.handshake.auth.userId as string;

      // Mark all unread messages in room as read
      const updatedMessages = await this.messagesService.markRoomAsRead(
        data.roomId,
        userId,
      );

      // Broadcast to room
      client.to(`room:${data.roomId}`).emit('room_messages_read', {
        roomId: data.roomId,
        userId,
        readAt: new Date(),
      });

      return { event: 'room_marked_as_read', data: updatedMessages };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  broadcastNewMessage(roomId: string, message: NewMessage) {
    this.server.to(`room:${roomId}`).emit('new_message', message);
  }
}
