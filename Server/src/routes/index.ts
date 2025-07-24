import { Router } from 'express';
import authRoutes from './auth.routes.js';
import leaseRoutes from './lease.routes.js';
import rightsRoutes from "./rights.routes.js";

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/lease', leaseRoutes);
router.use('/rights', rightsRoutes)

export default router;
