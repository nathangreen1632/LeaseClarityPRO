import { Response } from 'express';
import path from 'path';
import { Lease } from '../models/index.js';
import { AuthRequest } from '../middleware/auth.js';
import { extractTextFromPDF } from '../services/pdf.service.js';
import { summarizeLease } from '../services/openai.service.js';
import { getAllLeasesForUser } from '../services/lease.service.js';

// Upload Lease Controller
export const uploadLease = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // --- Defensive: check req.file.path existence and type ---
  if (!req.file || typeof req.file.path !== 'string') {
    return res.status(400).json({ error: 'No file uploaded or file path invalid' });
  }

  try {
    // Defensive: always store as string and ensure presence
    const filePath = req.file.path;
    const originalFileName = req.file.originalname || 'Lease.pdf';

    if (!filePath) {
      return res.status(400).json({ error: "File upload failed: missing file path" });
    }

    const lease = await Lease.create({
      filePath,
      originalFileName,
      userId: req.user.userId,
    });

    return res.status(201).json({
      id: lease.id,
      originalFileName: lease.originalFileName,
      uploadedAt: lease.createdAt,
    });
  } catch (err) {
    console.error('Error uploading lease:', err);
    return res.status(500).json({ error: 'Failed to upload lease' });
  }
};

// Summarize Lease Controller
export const summarizeLeaseController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { leaseId } = req.params;
  let lease;
  try {
    lease = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
  } catch (err) {
    console.error('Error fetching lease:', err);
    return res.status(500).json({ error: 'Database error while looking up lease.' });
  }
  if (!lease) {
    return res.status(404).json({ error: 'Lease not found' });
  }
  // --- Defensive: make error obvious if filePath is missing or wrong type ---
  if (!lease.filePath || typeof lease.filePath !== 'string') {
    console.error('Lease record missing filePath:', lease);
    return res.status(500).json({ error: 'Lease filePath is missing or invalid.' });
  }

  try {
    const result = await extractTextFromPDF(lease.filePath);
    if (!result.success) {
      return res.status(422).json({ error: result.error, details: result.details });
    }
    const summary = await summarizeLease(result.text);

    if (summary?.error) {
      return res.status(502).json({
        error: summary.message ?? 'AI lease summary failed',
        details: summary.raw ?? summary.details ?? null,
      });
    }
    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Error summarizing lease:', err);
    return res.status(500).json({ error: 'Failed to summarize lease' });
  }
};

// List all leases for the user
export const listLeasesController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const result = await getAllLeasesForUser(req.user.userId);

  if (Array.isArray(result)) {
    return res.status(200).json({ leases: result });
  } else {
    // Error object
    return res.status(500).json({ error: result.message, details: result.details });
  }
};

// Delete a lease for the user
export const deleteLeaseController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const leaseId = Number(req.params.leaseId);
  if (isNaN(leaseId)) {
    return res.status(400).json({ error: 'Invalid lease ID.' });
  }
  const lease = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
  if (!lease) {
    return res.status(404).json({ error: 'Lease not found.' });
  }
  try {
    await lease.destroy();
    return res.status(200).json({ message: 'Lease deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete lease.', details: err instanceof Error ? err.message : err });
  }
};

// Secure download for a lease PDF
export const downloadLeaseController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const leaseId = Number(req.params.leaseId);
  if (isNaN(leaseId)) {
    res.status(400).json({ error: 'Invalid lease ID.' });
    return;
  }
  const lease = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
  if (!lease) {
    res.status(404).json({ error: 'Lease not found.' });
    return;
  }
  try {
    res.download(
      path.resolve(lease.filePath),
      lease.originalFileName,
      (err) => {
        if (err && !res.headersSent) {
          res.status(500).json({ error: 'Failed to download lease.', details: err.message });
        }
      }
    );
    return;
  } catch (err) {
    res.status(500).json({ error: 'Download error.', details: err instanceof Error ? err.message : err });
    return;
  }
};
