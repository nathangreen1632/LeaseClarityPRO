import { Request, Response } from 'express';
import { fetchOpenStatesBills } from '../services/rights.service.js';
import { analyzeLegalConcerns } from '../services/openai.service.js';
import { Lease } from '../models/lease.model.js';
import { extractTextFromPDF } from '../utils/pdfTextExtractor.js';
import {TenantRightsBill, TenantRightsConcern} from "../types/index.js";

export const analyzeTenantRightsWithAI = async (req: Request, res: Response): Promise<void> => {
  const { leaseId, state } = req.body;

  if (!leaseId || !state) {
    res.status(400).json({ error: 'Missing leaseId or state' });
    return;
  }

  try {
    const lease: Lease | null = await Lease.findByPk(leaseId);

    if (!lease) {
      res.status(404).json({ error: `Lease with ID ${leaseId} not found.` });
      return;
    }

    let parsedText: string | undefined = lease.parsedText?.trim();

    if (!parsedText) {
      parsedText = await extractTextFromPDF(lease.filePath);

      if (!parsedText) {
        res.status(422).json({ error: 'Unable to extract lease content from PDF.' });
        return;
      }

      lease.parsedText = parsedText;
      await lease.save();
    }

    const redFlags: TenantRightsConcern[] = await analyzeLegalConcerns(parsedText, state);
    const bills: TenantRightsBill[] = await fetchOpenStatesBills(state);

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

