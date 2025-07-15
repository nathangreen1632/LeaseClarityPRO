import { Router } from 'express';
import {
  uploadLease,
  summarizeLeaseController,
  listLeasesController,
  deleteLeaseController,
  downloadLeaseController
} from '../controllers/lease.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router: Router = Router();

// Upload a lease PDF
router.post('/upload', authenticateJWT, upload.single('lease'), uploadLease);

// Summarize a specific lease
router.get('/:leaseId/summary', authenticateJWT, summarizeLeaseController);

// List all leases for the authenticated user
router.get('/', authenticateJWT, listLeasesController);

// Delete a specific lease for the authenticated user
router.delete('/:leaseId', authenticateJWT, deleteLeaseController);

// Download a specific lease PDF for the authenticated user
router.get('/:leaseId/download', authenticateJWT, downloadLeaseController);

export default router;
