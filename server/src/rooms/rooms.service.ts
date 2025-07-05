import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { TokenPayload } from '@/types';

import { CreateRoomDto } from './dto/create-room.dto';
import { RoomQueryParamDto } from './dto/room-query-param.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly jwtService: JwtService,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async findAll(query: RoomQueryParamDto) {
    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const filter = type ? { type } : {};

    const [rooms, total] = await Promise.all([
      this.roomModel.find(filter).skip(skip).limit(limit).lean(),
      this.roomModel.countDocuments(filter),
    ]);

    const pageMetaDto = new PageMetaDto({ page, limit, total });
    return new PageDto(rooms, pageMetaDto);
  }

  async findAllGroups(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.roomModel.find({ type: 'group' }).skip(skip).limit(limit).lean(),
      this.roomModel.countDocuments({ type: 'group' }),
    ]);

    const pageMetaDto = new PageMetaDto({
      page,
      limit,
      total,
    });

    return new PageDto(rooms, pageMetaDto);
  }

  findOne(id: string) {
    return this.roomModel.findById(id).exec();
  }

  async findRoomByUserId(userId: string, accessToken: string) {
    const payload = await this.jwtService.verifyAsync<TokenPayload>(
      accessToken,
      { secret: process.env.JWT_SECRET },
    );

    const { sub, email } = payload;

    const room = await this.roomModel.findOne({
      type: 'direct',
      participants: { $all: [userId, sub] },
    });

    if (!room) {
      const newRoom = await this.create({
        type: 'direct',
        participants: [sub, userId],
        name: `Chat with ${userId}`,
        createdBy: email,
      });

      if (!newRoom) {
        throw new Error('Failed to create room');
      }

      return { data: newRoom._id };
    }

    return { data: room._id };
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.roomModel.findByIdAndUpdate(id, updateRoomDto).exec();
  }

  remove(id: string) {
    return this.roomModel.findByIdAndDelete(id).exec();
  }

  addUserToWelcomeGroup(userId: string) {
    return this.roomModel
      .findOneAndUpdate(
        { name: 'Welcome' },
        { $addToSet: { participants: userId } },
        { new: true },
      )
      .exec();
  }
}
1;
