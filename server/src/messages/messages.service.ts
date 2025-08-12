import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async findAll(
    roomId: string,
    paginationDto: PaginationDto,
  ): Promise<PageDto<Message>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageModel.aggregate([
        { $match: { roomId: new Types.ObjectId(roomId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'sender',
            pipeline: [{ $project: { name: 1, color: 1 } }],
          },
        },
        { $unwind: '$sender' },
        { $project: { senderId: 0 } },
      ]),
      this.messageModel.countDocuments({ roomId }),
    ]);

    const pageMetaDto = new PageMetaDto({
      page,
      limit,
      total,
    });

    return new PageDto(messages, pageMetaDto);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto).exec();
  }

  remove(id: string) {
    return this.messageModel.findByIdAndDelete(id).exec();
  }

  getLastMessage(roomId: string) {
    return this.messageModel.findOne({ roomId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId);

    if (!message) {
      throw new Error('Message not found');
    }

    // Check if this user already marked the message as read
    const alreadyRead = message.readBy.some(
      (receipt) => JSON.stringify(receipt.userId) === userId,
    );

    if (!alreadyRead) {
      return this.messageModel
        .findByIdAndUpdate(
          messageId,
          {
            $push: {
              readBy: {
                userId: new Types.ObjectId(userId),
                readAt: new Date(),
              },
            },
            status: 'read',
          },
          { new: true },
        )
        .exec();
    }

    return message;
  }
}
