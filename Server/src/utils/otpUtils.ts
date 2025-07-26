import bcrypt from 'bcrypt';
import { Otp } from '../models/otp.model.js'; // Sequelize model

export function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOtpInDatabase(email: string, otp: string): Promise<void> {
  const hashedOtp = await bcrypt.hash(otp, 10); // ✅ bcrypt here
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.destroy({ where: { email } });

  await Otp.create({
    email,
    otpHash: hashedOtp,
    expiresAt,
  });
}
