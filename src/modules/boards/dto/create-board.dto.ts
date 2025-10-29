import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Ask me anything!', maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ required: false, example: 'Feel free to ask anything anonymously' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ default: false, description: 'Make board publicly discoverable' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean; // Default: false (private)

  @ApiProperty({ default: true, description: 'Allow anonymous replies' })
  @IsBoolean()
  @IsOptional()
  allowReplies?: boolean;
}
