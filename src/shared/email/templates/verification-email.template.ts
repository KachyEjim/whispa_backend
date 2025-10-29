import { ICommonTemplateData, IVerificationEmailData } from '../interfaces';

export function generateVerificationEmailTemplate(
  data: IVerificationEmailData & ICommonTemplateData,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
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
            color: #4F46E5;
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
            background-color: #4F46E5;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #4338CA;
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🔒 ${data.companyName}</div>
        </div>
        
        <h1 class="title">Verify Your Account</h1>
        
        <div class="content">
            <p>Hi ${data.userName},</p>
            
            <p>Thank you for signing up with ${data.companyName}! To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="alternative-link">${data.verificationUrl}</div>
            
            ${data.expiresIn ? `<div class="warning">⏰ This link will expire in ${data.expiresIn}. Please verify your account before it expires.</div>` : ''}
            
            <p>If you didn't create an account with ${data.companyName}, you can safely ignore this email.</p>
        </div>
        
        <div class="footer">
            <p><strong>${data.companyName}</strong></p>
            <p>Need help? Contact us at <a href="mailto:${data.supportEmail}" style="color: #4F46E5;">${data.supportEmail}</a></p>
            <p>&copy; ${data.currentYear} ${data.companyName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}
