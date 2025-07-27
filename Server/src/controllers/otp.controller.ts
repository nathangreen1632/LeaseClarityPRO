import { Request, Response } from 'express';
import { verifyRecaptchaToken } from '../services/recaptcha.service.js';
import { sendOtpEmail } from '../services/sendOtpEmail.service.js';
import { verifyOtpAndResetPassword } from '../services/otp.service.js';
import { storeOtpInDatabase, generateSixDigitCode } from '../utils/otpUtils.js';

// === ACTIVE EMAIL OTP FLOW ===
export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { email, captchaToken } = req.body;

  if (!email || !captchaToken) {
    console.warn('⚠️ Missing email or captcha token in request body:', { email, captchaToken });
    res.status(400).json({ error: 'Missing email or captcha token.' });
    return;
  }

  try {
    const isHuman: boolean = await verifyRecaptchaToken(captchaToken, 'send_otp');
    if (!isHuman) {
      console.warn('⚠️ Captcha verification failed for email:', email);
      res.status(403).json({ error: 'Captcha verification failed.' });
      return;
    }

    const otp = generateSixDigitCode();
    console.info('🔐 Generated OTP for email:', email);

    await storeOtpInDatabase(email, otp);
    console.info('✅ Stored OTP in database for:', email);

    await sendOtpEmail(email, otp);
    console.info('📧 OTP email sent to:', email);

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Failed to send OTP email:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      email,
    });
    res.status(500).json({ error: 'Server error while sending OTP email. Please try again.' });
  }
}

// === VERIFY EMAIL OTP AND RESET PASSWORD
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    console.warn('⚠️ Missing fields in OTP verification request:', { email, otp, newPassword });
    res.status(400).json({ error: 'Missing email, OTP, or new password.' });
    return;
  }

  try {
    await verifyOtpAndResetPassword({ email, otp, newPassword });
    console.info('✅ OTP verified and password reset for:', email);

    res.json({ success: true });

  } catch (error) {
    console.error('❌ OTP verification or password reset failed:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      email,
      otp,
    });
    res.status(400).json({ error: (error as Error).message || 'OTP verification failed.' });
  }
}

// === EXPLICIT EXPORTS FOR ROUTE MAPPING
export {
  sendOtp as sendEmailOtp,
  verifyOtp as verifyEmailOtp,
  // sendOtp as sendSmsOtp, // 🔒 Future use for Twilio
  // verifyOtp as verifySmsOtp,
};

/* === FUTURE TWILIO IMPLEMENTATION FOR SMS OTPs ===

export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { phone, captchaToken } = req.body;

  if (!phone || !captchaToken) {
    res.status(400).json({ error: 'Missing phone or captcha token.' });
    return;
  }

  try {
    const isHuman: boolean = await verifyRecaptchaToken(captchaToken, 'send_otp');
    if (!isHuman) {
      res.status(403).json({ error: 'Captcha verification failed.' });
      return;
    }

    await generateOtpForPhone(phone);
    res.json({ success: true });

  } catch (error) {
    console.error('❌ Failed to send SMS OTP:', error instanceof Error ? error.message : error);
    res.status(429).json({ error: (error as Error).message || 'SMS OTP failed to send.' });
  }
}
*/
