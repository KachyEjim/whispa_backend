import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { PublicController } from './public.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BoardsController, PublicController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
