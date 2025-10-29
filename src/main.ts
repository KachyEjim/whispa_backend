import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [
    'http://localhost:3000',
    'https://whispa-sand.vercel.app',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API prefix
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Serve Swagger UI static files
  app.use(
    '/api/docs',
    express.static(join(__dirname, '..', 'node_modules', 'swagger-ui-dist'), {
      index: false,
    }),
  );

  // Swagger Documentation Setup
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: '/api/docs/swagger-ui.css',
    customJs: ['/api/docs/swagger-ui-bundle.js', '/api/docs/swagger-ui-standalone-preset.js'],
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = configService.get<number>('PORT') || 4001;
  const host = '0.0.0.0'; // Listen on all network interfaces
  await app.listen(port, host);

  console.log(`🚀 Whispa Backend is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`🌐 Network access: http://0.0.0.0:${port}/${apiPrefix}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
