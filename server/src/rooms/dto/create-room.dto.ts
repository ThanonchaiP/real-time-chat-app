import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['direct', 'group'] })
  @IsNotEmpty()
  type: 'direct' | 'group';

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  participants: Array<string>;

  @ApiProperty()
  @IsNotEmpty()
  createdBy: string;
}
