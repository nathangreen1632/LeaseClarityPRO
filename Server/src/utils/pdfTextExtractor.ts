// Server/src/utils/pdfTextExtractor.ts
import fs from 'fs';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('❌ Failed to extract PDF text using pdfjs-dist:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
