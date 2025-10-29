import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  // Generate unique slug - just random letters (like NGL)
  private async generateSlug(title: string, userId: string): Promise<string> {
    // Generate random slug (10 characters for uniqueness)
    const slug = nanoid(10);

    // Verify uniqueness (extremely unlikely to collide with nanoid)
    const existing = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (existing) {
      // If by some miracle it exists, try again
      return this.generateSlug(title, userId);
    }

    return slug;
  }

  // Create new board
  async create(userId: string, createBoardDto: CreateBoardDto) {
    const slug = await this.generateSlug(createBoardDto.title, userId);

    const board = await this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        content: createBoardDto.content,
        slug,
        userId,
        isPublic: createBoardDto.isPublic ?? false, // Default: private
        allowReplies: createBoardDto.allowReplies ?? true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return board;
  }

  // Generate share link
  async generateShare(boardId: string, userId: string) {
    // Verify ownership
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { user: true },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('You do not own this board');
    }

    // Check if share already exists
    let share = await this.prisma.share.findUnique({
      where: { boardId },
    });

    if (share) {
      return share;
    }

    // Create share link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const publicUrl = `${baseUrl}/u/${board.user.username}/${board.slug}`;

    share = await this.prisma.share.create({
      data: {
        boardId,
        publicUrl,
      },
    });

    return share;
  }

  // Get board with share by ID
  async findOneWithShare(boardId: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        share: true,
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return board;
  }

  // Get user's boards
  async findAllByUser(userId: string) {
    return this.prisma.board.findMany({
      where: { userId },
      include: {
        share: true,
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get board by slug (public access)
  async findBySlug(username: string, slug: string) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        share: true,
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Verify username matches
    if (board.user.username !== username) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  // Update board settings
  async update(boardId: string, userId: string, updateData: UpdateBoardDto) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.board.update({
      where: { id: boardId },
      data: updateData,
      include: {
        share: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Delete board
  async remove(boardId: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.board.delete({
      where: { id: boardId },
    });

    return { message: 'Board deleted successfully' };
  }
}
