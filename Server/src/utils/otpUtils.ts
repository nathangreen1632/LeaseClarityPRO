import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Otp } from '../models/otp.model.js';

export function generateSixDigitCode(): string {
  const buffer: Buffer<ArrayBufferLike> = crypto.randomBytes(4);
  const number: number = buffer.readUInt32BE(0) % 1000000;
  return number.toString().padStart(6, '0');
}


export async function storeOtpInDatabase(email: string, otp: string): Promise<void> {
  const hashedOtp: string = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.destroy({ where: { email } });

  await Otp.create({
    email,
    otpHash: hashedOtp,
    expiresAt,
  });
}
