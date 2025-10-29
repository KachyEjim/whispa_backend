import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  ICommonTemplateData,
  IEmailOptions,
  IPasswordResetEmailData,
  IVerificationEmailData,
  IWelcomeEmailData,
} from '../interfaces';
import {
  generatePasswordResetEmailTemplate,
  generateVerificationEmailTemplate,
  generateWelcomeEmailTemplate,
} from '../templates/index';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('ZEPTOMAIL_FROM_EMAIL') || '';
    this.fromName = this.configService.get<string>('ZEPTOMAIL_FROM_NAME') || '';

    // Initialize ZeptoMail SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zeptomail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('ZEPTOMAIL_USER'),
        pass: this.configService.get<string>('ZEPTOMAIL_KEY'),
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  /**
   * Verify SMTP connection on service initialization
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ ZeptoMail SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('❌ Failed to verify ZeptoMail SMTP connection', error);
      this.logger.warn('Email service will continue, but emails may fail to send');
    }
  }

  /**
   * Get common template data for all emails
   */
  private getCommonTemplateData(): ICommonTemplateData {
    return {
      companyName: 'Whispa',
      supportEmail: this.configService.get<string>('SUPPORT_EMAIL', 'support@whispa.com'),
      currentYear: new Date().getFullYear(),
      appUrl: this.configService.get<string>('APP_URL', 'http://localhost:3000'),
    };
  }

  /**
   * Generic method to send email
   */
  async sendEmail(options: IEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || `"${this.fromName}" <${this.fromEmail}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`📧 Email sent successfully to ${mailOptions.to}`);
      this.logger.debug(`Message ID: ${info.messageId}`);

      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${options.to}`, error);
      this.logger.error(`Error details: ${error.message}`);
      return false;
    }
  }

  /**
   * Send verification email with token/code
   */
  async sendVerificationEmail(to: string, data: IVerificationEmailData): Promise<boolean> {
    try {
      const commonData = this.getCommonTemplateData();
      const html = generateVerificationEmailTemplate({ ...data, ...commonData });

      await this.sendEmail({
        to,
        subject: 'Verify Your Whispa Account',
        html,
      });

      this.logger.log(`✅ Verification email sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send verification email to ${to}`, error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, data: IPasswordResetEmailData): Promise<boolean> {
    try {
      const commonData = this.getCommonTemplateData();
      const html = generatePasswordResetEmailTemplate({ ...data, ...commonData });

      await this.sendEmail({
        to,
        subject: 'Reset Your Whispa Password',
        html,
      });

      this.logger.log(`✅ Password reset email sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send password reset email to ${to}`, error);
      return false;
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(to: string, data: IWelcomeEmailData): Promise<boolean> {
    try {
      const commonData = this.getCommonTemplateData();
      const html = generateWelcomeEmailTemplate({ ...data, ...commonData });

      await this.sendEmail({
        to,
        subject: `Welcome to ${commonData.companyName}! 🎉`,
        html,
      });

      this.logger.log(`✅ Welcome email sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email to ${to}`, error);
      return false;
    }
  }
}
