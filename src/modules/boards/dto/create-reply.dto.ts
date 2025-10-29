import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty({ example: 'This is my anonymous message', maxLength: 1000 })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiProperty({ default: true, description: 'Send reply anonymously' })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @ApiProperty({ required: false, description: 'Sender name if not anonymous' })
  @IsString()
  @IsOptional()
  senderName?: string;

  @ApiProperty({ default: false, description: 'Make reply visible on public board' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
