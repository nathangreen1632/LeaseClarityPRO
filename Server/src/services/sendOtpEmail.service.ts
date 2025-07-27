import {CreateEmailResponse, Resend} from 'resend';
import { User } from '../models/user.model.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail: string = process.env.FROM_EMAIL ?? '';

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  if (!process.env.RESEND_API_KEY || !fromEmail) {
    console.error('Missing required environment variables for Resend.');
    return;
  }

  try {
    const user: User | null = await User.findOne({ where: { email: to } });
    const name: string = user?.firstName?.trim() ?? 'there';

    const response: CreateEmailResponse = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Your LeaseClarityPRO Verification Code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6;">
          <p>Hello, ${name},</p>
          <p>Your one-time verification code is:</p>
          <h2 style="color: #10b981; font-size: 24px; margin: 12px 0;">${otp}</h2>
          <p>This code will expire in 5 minutes. Do not share it with anyone.</p>
          <br/>
          <p style="margin-bottom: 0;">— The LeaseClarityPRO Team</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #666;">
            If you did not request this code, you can safely ignore this email.
          </p>
          <p style="font-size: 12px; color: #666;">
            Please do not reply. This mailbox is not monitored.
          </p>
        </div>
      `
    });

    if (response.error) {
      console.error('Resend API error:', response.error);
    } else {
      console.log('OTP email sent successfully:', response);
    }

  } catch (err) {
    console.error('Error sending OTP email:', err);
  }
}
