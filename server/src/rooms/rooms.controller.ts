import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '@/common/guards/jwt-cookie.guard';
import { Request } from 'express';

import { CreateRoomDto } from './dto/create-room.dto';
import { RoomQueryParamDto } from './dto/room-query-param.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@UseGuards(JwtCookieAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll(@Query() query: RoomQueryParamDto) {
    return this.roomsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const token = req.cookies['access_token'] as string;
    return this.roomsService.findOne(id, token);
  }

  @Get('user/:userId')
  findRoomByUserId(@Param('userId') userId: string, @Req() req: Request) {
    const token = req.cookies['access_token'] as string;
    return this.roomsService.findRoomByUserId(userId, token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  @Get('recent/:userId')
  getRecentMessage(@Param('userId') userId: string) {
    return this.roomsService.getRecentMessage(userId);
  }
}
