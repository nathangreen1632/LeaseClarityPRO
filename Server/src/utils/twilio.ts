import twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  throw new Error('❌ Missing Twilio environment variables. Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set.');
}

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
