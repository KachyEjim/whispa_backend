import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardsService } from '../boards/boards.service';

@ApiTags('Public')
@Controller('u')
export class PublicController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get(':username/:slug')
  @ApiOperation({ summary: 'Get board by username and slug (public)' })
  @ApiResponse({ status: 200, description: 'Board found' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async getBoardBySlug(@Param('username') username: string, @Param('slug') slug: string) {
    return this.boardsService.findBySlug(username, slug);
  }
}
