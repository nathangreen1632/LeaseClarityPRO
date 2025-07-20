import { Router } from 'express';
import {
  uploadLease,
  summarizeLeaseController,
  listLeasesController,
  deleteLeaseController,
  downloadLeaseController,
  humanSummaryController
} from '../controllers/lease.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router: Router = Router();

router.post('/upload', authenticateJWT, upload.single('lease'), uploadLease);

router.get('/:leaseId/summary/human', authenticateJWT, humanSummaryController);

router.get('/:leaseId/summary', authenticateJWT, summarizeLeaseController);

router.get('/', authenticateJWT, listLeasesController);

router.delete('/:leaseId', authenticateJWT, deleteLeaseController);

router.get('/:leaseId/download', authenticateJWT, downloadLeaseController);

export default router;
