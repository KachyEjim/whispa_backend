import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Whispa API')
  .setDescription('API documentation for Whispa - Anonymous Q&A Platform')
  .setVersion('1.0')
  .addTag('Authentication', 'Authentication and user management endpoints')
  .addTag('Users', 'User profile and data endpoints')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();
