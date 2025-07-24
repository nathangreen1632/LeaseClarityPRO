import fs from 'fs/promises';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

type ExtractTextResult =
  | { success: true; text: string }
  | { success: false; error: string; details?: unknown };

interface PDFPage {
  getTextContent: () => Promise<PDFTextContent>;
}

interface PDFTextContent {
  items: { str: string }[];
}

interface PDFDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPage>;
}

try {
  if ('setVerbosityLevel' in pdfjsLib && 'VerbosityLevel' in pdfjsLib) {
    (pdfjsLib as any).setVerbosityLevel((pdfjsLib as any).VerbosityLevel.ERRORS);
  }
} catch (err) {
  console.warn('PDF.js verbosity level could not be set:', err);
}

export const extractTextFromPDF: (filePath: string) => Promise<ExtractTextResult> = async (filePath: string): Promise<ExtractTextResult> => {
  if (!filePath) {
    const msg = 'No PDF file path provided.';
    console.error('[extractTextFromPDF]', msg);
    return { success: false, error: msg };
  }

  let buffer: Buffer;
  try {
    buffer = await fs.readFile(filePath);
  } catch (err) {
    const msg = `Error reading PDF file from: ${filePath}`;
    console.error('[extractTextFromPDF]', msg, err);
    return { success: false, error: msg, details: err };
  }

  let doc: PDFDocument;
  try {
    doc = await (pdfjsLib as any).getDocument({ data: buffer }).promise;
  } catch (err) {
    const msg = `Error parsing PDF document: ${filePath}`;
    console.error('[extractTextFromPDF]', msg, err);
    return { success: false, error: msg, details: err };
  }

  try {
    let text: string = '';

    for (let i: number = 1; i <= doc.numPages; i++) {
      let page: PDFPage;
      try {
        page = await doc.getPage(i);
      } catch (err) {
        console.warn(`[extractTextFromPDF] Failed to load page ${i}:`, err);
        continue;
      }

      let content: PDFTextContent;
      try {
        content = await page.getTextContent();
      } catch (err) {
        console.warn(`[extractTextFromPDF] Failed to get content for page ${i}:`, err);
        continue;
      }

      const pageText: string = content.items.map((item: {str: string}): string => item.str).join(' ');
      text += pageText + '\n';
    }

    if (!text.trim()) {
      const msg = 'PDF processed, but no text was extracted.';
      console.warn('[extractTextFromPDF]', msg);
      return { success: false, error: msg };
    }

    return { success: true, text };
  } catch (err) {
    const msg = `Unexpected error extracting text from PDF: ${filePath}`;
    console.error('[extractTextFromPDF]', msg, err);
    return { success: false, error: msg, details: err };
  }
};
