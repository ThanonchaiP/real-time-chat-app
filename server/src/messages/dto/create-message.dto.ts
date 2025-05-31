import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'Content of the message' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID of the room where the message is sent' })
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'ID of the user sending the message' })
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({
    description: 'Array of attachments associated with the message',
    required: false,
  })
  attachments?: Array<{
    type: string;
    url: string;
    thumbnailUrl?: string;
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
}
