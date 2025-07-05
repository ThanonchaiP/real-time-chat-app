import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { PROFILE_COLOR } from '@/common/constants';
import { RoomsService } from '@/rooms/rooms.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly roomService: RoomsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
    }

    const user = {
      name,
      email,
      password: await argon2.hash(password),
      color: PROFILE_COLOR[Math.floor(Math.random() * PROFILE_COLOR.length)],
    };

    const newUser = await this.userModel.create(user);

    if (!newUser) {
      throw new HttpException(
        'User creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.roomService.addUserToWelcomeGroup(newUser._id.toString());

    return newUser;
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        this.userModel
          .find()
          .select('-password')
          .skip(skip)
          .limit(limit)
          .lean(),
        this.userModel.countDocuments(),
      ]);

      const pageMetaDto = new PageMetaDto({
        page,
        limit,
        total,
      });

      return new PageDto(users, pageMetaDto);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id, { password: 0 }).lean();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .lean();

    if (!existingUser) {
      throw new NotFoundException(`User #${id.toString()} not found`);
    }

    return existingUser;
  }
}
