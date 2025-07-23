import { Request, Response } from 'express';
import { fetchOpenStatesBills } from '../services/rights.service.js';
import { analyzeLegalConcerns } from '../services/openai.service.js';
import { Lease } from '../models/lease.model.js';
import { extractTextFromPDF } from '../utils/pdfTextExtractor.js';

export const analyzeTenantRightsWithAI = async (req: Request, res: Response): Promise<void> => {
  const { leaseId, state } = req.body;

  if (!leaseId || !state) {
    res.status(400).json({ error: 'Missing leaseId or state' });
    return;
  }

  try {
    console.log('🔍 leaseId:', leaseId);
    const lease = await Lease.findByPk(leaseId);

    if (!lease) {
      res.status(404).json({ error: `Lease with ID ${leaseId} not found.` });
      return;
    }

    let parsedText = lease.parsedText?.trim();

    if (!parsedText) {
      console.log('📄 No parsedText found. Attempting to extract from PDF:', lease.filePath);
      parsedText = await extractTextFromPDF(lease.filePath);

      if (!parsedText) {
        res.status(422).json({ error: 'Unable to extract lease content from PDF.' });
        return;
      }

      lease.parsedText = parsedText;
      await lease.save();
    }

    const redFlags = await analyzeLegalConcerns(parsedText, state);
    const bills = await fetchOpenStatesBills(state);

    res.status(200).json({
      state,
      analysis: redFlags,
      bills,
    });
  } catch (err) {
    console.error('❌ AI analysis failed:', err);
    res.status(500).json({
      error: 'AI analysis failed',
      details: (err as Error).message || 'Unknown error',
    });
  }
};

