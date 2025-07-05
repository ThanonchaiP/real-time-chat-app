import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '@/common/dtos/pagination.dto';

export enum RoomType {
  DIRECT = 'direct',
  GROUP = 'group',
}

export class RoomQueryParamDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: RoomType, enumName: 'RoomType' })
  @IsOptional()
  @IsEnum(RoomType)
  type?: RoomType;
}
