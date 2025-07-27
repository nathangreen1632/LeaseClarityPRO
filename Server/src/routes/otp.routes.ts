import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  // sendSmsOtp,
  // verifySmsOtp,
} from '../controllers/otp.controller.js';

// import { sendSmsOtp, verifySmsOtp } from '../controllers/otp.controller.js'; // 🔒 Future use

const router: Router = Router();

// ✅ Email OTP Routes (active)
router.post('/send', sendOtp);
router.post('/verify', verifyOtp);
router.post('/email/verify', verifyOtp);

// 🔒 Future Twilio SMS OTP routes (commented)
// router.post('/send-sms', sendSmsOtp);
// router.post('/verify-sms', verifySmsOtp);

export default router;
