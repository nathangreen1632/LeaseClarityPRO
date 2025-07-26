import { Router } from 'express';
import authRoutes from './auth.routes.js';
import leaseRoutes from './lease.routes.js';
import rightsRoutes from './rights.routes.js';
import otpRoutes from './otp.routes.js'; // ✅ Add this line

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/lease', leaseRoutes);
router.use('/rights', rightsRoutes);
router.use('/otp', otpRoutes); // ✅ Mount under /api/otp from app.ts

export default router;
