import { ICommonTemplateData, IPasswordResetEmailData } from '../interfaces';

export function generatePasswordResetEmailTemplate(
  data: IPasswordResetEmailData & ICommonTemplateData,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #DC2626;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1F2937;
            margin-bottom: 20px;
        }
        .content {
            color: #4B5563;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #DC2626;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #B91C1C;
        }
        .alternative-link {
            background-color: #F3F4F6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #6B7280;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #9CA3AF;
            font-size: 14px;
        }
        .warning {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
        }
        .security-notice {
            background-color: #FEE2E2;
            border-left: 4px solid #DC2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🔐 ${data.companyName}</div>
        </div>
        
        <h1 class="title">Reset Your Password</h1>
        
        <div class="content">
            <p>Hi ${data.userName},</p>
            
            <p>We received a request to reset the password for your ${data.companyName} account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="alternative-link">${data.resetUrl}</div>
            
            ${data.expiresIn ? `<div class="warning">⏰ This password reset link will expire in ${data.expiresIn}. Please reset your password before it expires.</div>` : ''}
            
            <div class="security-notice">
                <strong>🛡️ Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>${data.companyName}</strong></p>
            <p>Need help? Contact us at <a href="mailto:${data.supportEmail}" style="color: #DC2626;">${data.supportEmail}</a></p>
            <p>&copy; ${data.currentYear} ${data.companyName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}
