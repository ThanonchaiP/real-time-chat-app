import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({ default: 't.paliwong@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '1234' })
  password: string;
}
