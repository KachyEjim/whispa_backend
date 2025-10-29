import { ICommonTemplateData, IWelcomeEmailData } from '../interfaces';

export function generateWelcomeEmailTemplate(
  data: IWelcomeEmailData & ICommonTemplateData,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${data.companyName}</title>
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
            color: #10B981;
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
            background-color: #10B981;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #059669;
        }
        .features {
            background-color: #F0FDF4;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature-item {
            margin: 15px 0;
            padding-left: 30px;
            position: relative;
        }
        .feature-item:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10B981;
            font-weight: bold;
            font-size: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #9CA3AF;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🎉 ${data.companyName}</div>
        </div>
        
        <h1 class="title">Welcome to ${data.companyName}!</h1>
        
        <div class="content">
            <p>Hi ${data.userName},</p>
            
            <p>Welcome aboard! We're thrilled to have you join the ${data.companyName} community. Your account has been successfully created and you're all set to get started.</p>
            
            <div class="features">
                <h3 style="color: #10B981; margin-top: 0;">What you can do with ${data.companyName}:</h3>
                <div class="feature-item">Create and manage your anonymous Q&A boards</div>
                <div class="feature-item">Receive anonymous questions from your audience</div>
                <div class="feature-item">Share your board link across social media</div>
                <div class="feature-item">Engage with your community privately and securely</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${data.appUrl}" class="button">Get Started</a>
            </div>
            
            <p>If you have any questions or need assistance, our support team is here to help. Just reply to this email or reach out to us at ${data.supportEmail}.</p>
            
            <p>Happy connecting!</p>
            <p>The ${data.companyName} Team</p>
        </div>
        
        <div class="footer">
            <p><strong>${data.companyName}</strong></p>
            <p>Need help? Contact us at <a href="mailto:${data.supportEmail}" style="color: #10B981;">${data.supportEmail}</a></p>
            <p>&copy; ${data.currentYear} ${data.companyName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}
