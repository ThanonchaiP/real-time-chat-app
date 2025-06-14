import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';

import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  create(createRoomDto: CreateRoomDto) {
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.roomModel.find().skip(skip).limit(limit).lean(),
      this.roomModel.countDocuments(),
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

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.roomModel.findByIdAndUpdate(id, updateRoomDto).exec();
  }

  remove(id: string) {
    return this.roomModel.findByIdAndDelete(id).exec();
  }
}
