import { Router } from 'express';
import authRoutes from './auth.routes.js';
import leaseRoutes from './lease.routes.js';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/lease', leaseRoutes);

export default router;
