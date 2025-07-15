import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractFirstJsonObject(text: string): string | null {
  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) return null;
  let open = 0;
  for (let i = firstBrace; i < text.length; i++) {
    if (text[i] === '{') open++;
    if (text[i] === '}') open--;
    if (open === 0) {
      const candidate = text.slice(firstBrace, i + 1);
      try {
        JSON.parse(candidate);
        return candidate;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export const summarizeLease = async (text: string): Promise<any> => {
  const prompt = `
You are an expert in lease agreements. Given the following lease text, extract and summarize these key terms:
- Monthly Rent
- Lease Start Date
- Lease End Date
- Security Deposit
- Notice Period
- Late Fees
- Pet Policy

Return the results as a JSON object, with each term as a separate field. Only include fields that are found.

Respond ONLY with a valid JSON object, not inside a markdown code block or with any commentary.

Lease Agreement:
${text}
  `;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You extract structured data from lease agreements.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;
    let cleanedContent = (content ?? '').replace(/```(?:json)?/gi, '').trim();
    const jsonStr = extractFirstJsonObject(cleanedContent);

    if (!jsonStr) {
      return {
        error: true,
        message: 'No JSON found in model response.',
        raw: content,
      };
    }

    try {
      return JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Error parsing JSON from AI response:', parseErr, jsonStr);
      return {
        error: true,
        message: 'Failed to parse AI response as JSON.',
        raw: content,
      };
    }
  } catch (apiErr) {
    return {
      error: true,
      message: 'OpenAI API call failed.',
      details: apiErr instanceof Error ? apiErr.message : apiErr,
    };
  }
};
