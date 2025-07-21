import fs from 'fs/promises';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pdfjsLib;


type ExtractTextResult =
  | { success: true; text: string }
  | { success: false; error: string; details?: unknown };

export const extractTextFromPDF = async (filePath: string): Promise<ExtractTextResult> => {
  if (!filePath) {
    const msg = 'Invalid or missing file path for PDF.';
    console.error('extractTextFromPDF:', msg, filePath);
    return { success: false, error: msg };
  }

  let data: Buffer;
  try {
    data = await fs.readFile(filePath);
  } catch (err) {
    const msg = `Failed to read PDF file at path: ${filePath}`;
    console.error('extractTextFromPDF:', msg, err);
    return { success: false, error: msg, details: err };
  }

  let pdf: any;
  try {
    pdf = await getDocument({ data }).promise;
  } catch (err) {
    const msg = `Failed to parse PDF at path: ${filePath}`;
    console.error('extractTextFromPDF:', msg, err);
    return { success: false, error: msg, details: err };
  }

  let text: string = '';
  try {
    for (let i: number = 1; i <= pdf.numPages; i++) {
      const page: any = await pdf.getPage(i);
      const content: any = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return { success: true, text };
  } catch (err) {
    const msg = `Failed to extract text from PDF: ${filePath}`;
    console.error('extractTextFromPDF:', msg, err);
    return { success: false, error: msg, details: err };
  }
};
