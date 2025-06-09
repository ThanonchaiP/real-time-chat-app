import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';

import { PROFILE_COLOR } from 'src/common/constants';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

    return await this.userModel.create(user);
  }

  async findAll() {
    return await this.userModel.find().select('-password').lean();
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
