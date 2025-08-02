import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
      this.messageModel
        .find({ roomId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
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
}
