export enum EmailType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  WELCOME = 'WELCOME',
}

export interface IEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface IVerificationEmailData {
  userName: string;
  verificationUrl: string;
  expiresIn?: string;
}

export interface IPasswordResetEmailData {
  userName: string;
  resetUrl: string;
  expiresIn?: string;
}

export interface IWelcomeEmailData {
  userName: string;
  email: string;
}

export interface ICommonTemplateData {
  companyName: string;
  supportEmail: string;
  currentYear: number;
  appUrl: string;
}
