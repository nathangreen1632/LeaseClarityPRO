import { Response } from 'express';
import path from 'path';
import { Lease } from '../models/index.js';
import { AuthRequest } from '../middleware/auth.js';
import { extractTextFromPDF } from '../services/pdf.service.js';
import {askQuestionAboutLease, humanReadableLeaseSummary, summarizeLease} from '../services/openai.service.js';
import {getAllLeasesForUser, LeaseServiceError} from '../services/lease.service.js';

export const uploadLease = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file path invalid' });
  }

  try {
    const filePath: string = req.file.path;
    const originalFileName: string = req.file.originalname || 'Lease.pdf';

    if (!filePath) {
      return res.status(400).json({ error: "File upload failed: missing file path" });
    }

    const lease: Lease = await Lease.create({
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

  if (!lease.filePath || typeof lease.filePath !== 'string') {
    console.error('Lease record missing filePath:', lease);
    return res.status(500).json({ error: 'Lease filePath is missing or invalid.' });
  }

  try {
    const result = await extractTextFromPDF(lease.filePath);
    if (!result.success) {
      return res.status(422).json({ error: result.error, details: result.details });
    }

    const summary: any = await summarizeLease(result.text);
    if (summary?.error) {
      return res.status(502).json({
        error: summary.message ?? 'AI lease summary failed',
        details: summary.raw ?? summary.details ?? null,
      });
    }

    return res.status(200).json({
      summary,
      leaseFileName: lease.originalFileName ?? null,
    });
  } catch (err) {
    console.error('Error summarizing lease:', err);
    return res.status(500).json({ error: 'Failed to summarize lease' });
  }
};

export const listLeasesController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const result: LeaseServiceError | Lease[] = await getAllLeasesForUser(req.user.userId);

  if (Array.isArray(result)) {
    return res.status(200).json({ leases: result });
  } else {
    return res.status(500).json({ error: result.message, details: result.details });
  }
};

export const deleteLeaseController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const leaseId: number = Number(req.params.leaseId);
  if (isNaN(leaseId)) {
    return res.status(400).json({ error: 'Invalid lease ID.' });
  }
  const lease: Lease | null = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
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

export const downloadLeaseController = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const leaseId: number = Number(req.params.leaseId);
  if (isNaN(leaseId)) {
    res.status(400).json({ error: 'Invalid lease ID.' });
    return;
  }
  const lease: Lease | null = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
  if (!lease) {
    res.status(404).json({ error: 'Lease not found.' });
    return;
  }
  try {
    res.download(
      path.resolve(lease.filePath),
      lease.originalFileName,
      (err: Error): void => {
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

export const humanSummaryController = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { leaseId } = req.params;

  let lease;
  try {
    lease = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
  } catch (err) {
    console.error('Error fetching lease:', err);
    return res.status(500).json({ error: 'Database error while looking up lease.' });
  }
  if (!lease) return res.status(404).json({ error: 'Lease not found' });
  if (!lease.filePath || typeof lease.filePath !== 'string') {
    return res.status(500).json({ error: 'Lease filePath is missing or invalid.' });
  }

  try {
    const result = await extractTextFromPDF(lease.filePath);
    if (!result.success) {
      return res.status(422).json({ error: result.error, details: result.details });
    }
    const summary: any = await humanReadableLeaseSummary(result.text);

    if (summary?.error) {
      return res.status(502).json({
        error: summary.message ?? 'AI lease summary failed',
        details: summary.raw ?? summary.details ?? null,
      });
    }
    return res.status(200).json({ summary: summary.summary });
  } catch (err) {
    console.error('Error generating human-friendly summary:', err);
    return res.status(500).json({ error: 'Failed to generate human-friendly summary' });
  }
};

export const askLeaseQuestionController = async (req: AuthRequest, res: Response) => {
  const { leaseId } = req.params;
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing question' });
  }

  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const disallowed: string[] = ['bitcoin', 'kill', 'sex', 'game', 'restaurant'];
  const isAbusive = disallowed.some(term => question.toLowerCase().includes(term));
  if (isAbusive) {
    return res.status(400).json({ error: 'Your question appears unrelated to a lease.' });
  }

  const lease: Lease | null = await Lease.findOne({ where: { id: leaseId, userId: req.user.userId } });
  if (!lease?.filePath) {
    return res.status(404).json({ error: 'Lease not found' });
  }

  const result = await extractTextFromPDF(lease.filePath);
  if (!result.success) {
    return res.status(422).json({ error: result.error });
  }

  const response = await askQuestionAboutLease(result.text, question);

  if (response.error) {
    return res.status(502).json({ error: response.message });
  }

  return res.status(200).json({ answer: response.answer });
};
