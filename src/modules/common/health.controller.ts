import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      date: new Date().toISOString(),
      message: 'Whispa backend is healthy',
    };
  }
}
