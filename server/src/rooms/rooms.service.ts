/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { TokenPayload } from '@/types';
import { UsersService } from '@/users/users.service';

import { CreateRoomDto } from './dto/create-room.dto';
import { RoomQueryParamDto } from './dto/room-query-param.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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
      const user = await this.usersService.findOne(userId);

      if (!user) throw new Error('User not found');

      const newRoom = await this.create({
        type: 'direct',
        participants: [sub, userId],
        name: user.name,
        color: user.color,
        createdBy: email,
      });

      if (!newRoom) throw new Error('Failed to create room');

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

  async getRecentMessage(userId: string) {
    // 1️⃣ ดึงห้องพร้อมข้อความล่าสุดด้วย aggregation
    const rooms = await this.roomModel.aggregate([
      {
        $match: {
          participants: userId,
        },
      },
      {
        $lookup: {
          from: 'messages',
          let: { roomId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$roomId', '$$roomId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                createdAt: 1,
                content: 1,
                contentType: 1,
              },
            },
          ],
          as: 'lastMessage',
        },
      },
      { $unwind: '$lastMessage' },
      {
        $sort: {
          'lastMessage.createdAt': -1,
        },
      },
    ]);

    // 2️⃣ หา chatWithIds ของทุกห้อง direct (ยกเว้น userId ตัวเอง)
    const chatWithIds = rooms.map((room: { participants: string[] }) =>
      room.participants.find((id: string) => id !== userId),
    ) as string[];

    // 3️⃣ ดึง user ทีเดียวทั้งหมด
    const users = await this.usersService.findManyByIds(chatWithIds);

    // 4️⃣ สร้าง map userId → user
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // 5️⃣ ใส่ชื่อคู่สนทนาลงในห้อง
    const updatedRooms = rooms.map((room) => {
      if (room.type === 'direct' && room.participants.length === 2) {
        const chatWithId = room.participants.find(
          (id: string) => id !== userId,
        );
        const chatWithUser = userMap.get(chatWithId?.toString() as string);
        return {
          ...room,
          name: chatWithUser?.name ?? 'Unknown',
          chatWithId,
        };
      }
      return room;
    });

    return updatedRooms;
  }
}
