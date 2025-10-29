/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailService } from '@/shared/email';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Create user (validation and hashing handled in UsersService)
    const user = await this.usersService.create(registerDto);

    // Generate JWT token
    const token = await this.generateToken(user);

    // Send welcome email (non-blocking - don't wait for email to complete)
    this.sendWelcomeEmail(user).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    // Validate user credentials
    const user = await this.validateUser(loginDto.identifier, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = await this.generateToken(user);

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateUser(identifier: string, password: string) {
    // Find user by email or username
    const user = await this.usersService.findByEmailOrUsername(identifier);

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload);
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Send welcome email to newly registered user
   */
  private async sendWelcomeEmail(user: any): Promise<void> {
    if (!user.email) {
      return;
    }

    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.username;

    await this.emailService.sendWelcomeEmail(user.email, {
      userName,
      email: user.email,
    });
  }

  /**
   * Send verification email with token
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.username;

    const appUrl = this.configService.get<string>('APP_URL');
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

    await this.emailService.sendVerificationEmail(email, {
      userName,
      verificationUrl,
      expiresIn: '24 hours',
    });
  }

  /**
   * Send password reset email with token
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.username;

    const appUrl = this.configService.get<string>('APP_URL');
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail(email, {
      userName,
      resetUrl,
      expiresIn: '1 hour',
    });
  }

  /**
   * Generate password reset token and send email
   */
  async forgotPassword(email: string): Promise<void> {
    // Find user by email
    const user = await this.usersService.findByEmail(email);

    // Don't reveal if email exists (security best practice)
    // Always return success to prevent email enumeration
    if (!user) {
      return;
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    // Send password reset email (non-blocking)
    this.sendPasswordResetEmail(email, resetToken).catch((error) => {
      console.error('Failed to send password reset email:', error);
    });
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Verify and decode token
      const payload = this.jwtService.verify(token);

      // Check if token is for password reset
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      // Find user
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update user password
      await this.usersService.updatePassword(user.id, passwordHash);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Reset token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid reset token');
      }
      throw error;
    }
  }
}
