import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Check if username is available (public endpoint)
   */
  @Get('check-username/:username')
  @ApiOperation({ summary: 'Check if username is available' })
  @ApiResponse({ status: 200, description: 'Returns username availability' })
  @ApiResponse({ status: 400, description: 'Invalid username format' })
  async checkUsername(@Param('username') username: string) {
    // Basic validation
    if (!username || username.length < 3) {
      return { available: false, message: 'Username must be at least 3 characters' };
    }

    if (username.length > 30) {
      return { available: false, message: 'Username must not exceed 30 characters' };
    }

    // Check if username matches allowed pattern
    const usernamePattern = /^[a-zA-Z0-9_-]+$/;
    if (!usernamePattern.test(username)) {
      return {
        available: false,
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
      };
    }

    // Check if username exists
    const existingUser = await this.usersService.findByUsername(username);

    if (existingUser) {
      return { available: false, message: 'Username is already taken' };
    }

    return { available: true, message: 'Username is available' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
