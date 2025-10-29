import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username or email address',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string; // Can be email or username

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'User password (min 8 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
