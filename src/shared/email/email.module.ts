import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EmailService } from './services/email.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ZEPTOMAIL_USER: Joi.string().required(),
        ZEPTOMAIL_KEY: Joi.string().required(),
        ZEPTOMAIL_FROM_EMAIL: Joi.string().email().required(),
        ZEPTOMAIL_FROM_NAME: Joi.string().required(),
        APP_URL: Joi.string().uri().required(),
        SUPPORT_EMAIL: Joi.string().email().optional(),
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
