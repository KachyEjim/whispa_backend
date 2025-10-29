import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
  };
}

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new board (requires auth)' })
  @ApiResponse({ status: 201, description: 'Board created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Req() req: AuthRequest, @Body() createBoardDto: CreateBoardDto) {
    const board = await this.boardsService.create(req.user.id, createBoardDto);

    // Auto-generate share link
    const share = await this.boardsService.generateShare(board.id, req.user.id);

    return {
      ...board,
      share,
    };
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate/get share link for board' })
  @ApiResponse({ status: 200, description: 'Share link generated' })
  async generateShare(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.boardsService.generateShare(id, req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user boards' })
  async getMyBoards(@Req() req: AuthRequest) {
    return this.boardsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get board by ID' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.boardsService.findOneWithShare(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update board settings' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(id, req.user.id, updateBoardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete board' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.boardsService.remove(id, req.user.id);
  }
}
