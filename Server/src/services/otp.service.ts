import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sequelize } from '../config/db.js';
import { twilioClient } from '../utils/twilio.js';
import { QueryTypes } from 'sequelize';

const OTP_EXPIRY_MINUTES = 5;
const OTP_RATE_LIMIT_SECONDS = 60;

interface OtpRequestRecord {
  hashed_otp: string;
  expires_at: string; // ISO format
}

// === 🔐 Used for phone/SMS OTPs ===
function generateSecureOtp(): string {
  const otpBuffer = crypto.randomBytes(3);
  const otp = parseInt(otpBuffer.toString('hex'), 16) % 1000000;
  return otp.toString().padStart(6, '0');
}

// === 🔐 Twilio OTP generation for SMS ===
export async function generateOtpForPhone(phone: string): Promise<void> {
  const recentRequests = await sequelize.query<OtpRequestRecord>(
    `
        SELECT * FROM otp_requests
        WHERE phone_number = :phone
          AND created_at > NOW() - INTERVAL :interval
    `,
    {
      replacements: {
        phone,
        interval: `${OTP_RATE_LIMIT_SECONDS} seconds`, // now safely parameterized
      },
      type: QueryTypes.SELECT,
    }
  );

  if (recentRequests.length > 0) {
    throw new Error('Too many requests. Please wait.');
  }

  const otp = generateSecureOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await sequelize.query(
    `
        INSERT INTO otp_requests (phone_number, hashed_otp, expires_at, created_at)
        VALUES (:phone, :hashedOtp, :expiresAt, NOW())
    `,
    {
      replacements: { phone, hashedOtp, expiresAt },
      type: QueryTypes.INSERT,
    }
  );

  await twilioClient.messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE!,
    body: `Your LeaseClarityPRO reset code is: ${otp}`,
  });
}

// === ✅ ACTIVE for EMAIL OTP flow ===
export async function verifyOtpAndResetPassword({
                                                  email,
                                                  otp,
                                                  newPassword,
                                                }: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<void> {
  const records = await sequelize.query(
    `
        SELECT * FROM email_otp_requests
        WHERE email = :email
        ORDER BY created_at DESC
        LIMIT 1
    `,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    }
  );

  const record = records[0] as {
    otp_hash: string;
    expires_at: string;
  };

  if (!record || new Date() > new Date(record.expires_at)) {
    throw new Error('OTP expired or not found.');
  }

  const isMatch = await bcrypt.compare(otp, record.otp_hash);
  if (!isMatch) {
    throw new Error('Incorrect OTP.');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await sequelize.query(
    `
        UPDATE users
        SET "passwordHash" = :passwordHash
        WHERE email = :email
    `,
    {
      replacements: { passwordHash, email },
      type: QueryTypes.UPDATE,
    }
  );

  await sequelize.query(
    `
        DELETE FROM email_otp_requests
        WHERE email = :email
    `,
    {
      replacements: { email },
      type: QueryTypes.DELETE,
    }
  );
}


