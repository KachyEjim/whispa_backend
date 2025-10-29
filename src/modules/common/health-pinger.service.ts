import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HealthPingerService implements OnModuleInit {
  private readonly logger = new Logger(HealthPingerService.name);
  private intervalId: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.startPinging();
  }

  startPinging() {
    const backendHealthUrl =
      process.env.BACKEND_HEALTH_URL ||
      `${process.env.BACKEND_URL || 'http://localhost:4001'}/health`;
    const frontendUrl =
      process.env.FRONTEND_URL || 'https://whispa-535uvpb6k-onyedikachi-ejims-projects.vercel.app/';
    this.ping(backendHealthUrl);
    this.ping(frontendUrl);
    this.intervalId = setInterval(() => {
      this.ping(backendHealthUrl);
      this.ping(frontendUrl);
    }, 30000);
  }

  async ping(url: string) {
    try {
      await axios.get(url);
      // No action needed with response
    } catch (err) {
      this.logger.warn(`Ping to ${url} failed: ${err.message}`);
    }
  }
}
