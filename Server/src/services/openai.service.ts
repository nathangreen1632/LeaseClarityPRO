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
You are an expert in lease agreements. Given the following lease text, extract and summarize these key terms to each of their respective fields.:

- Monthly Rent
- Lease Start Date
- Lease End Date
- Security Deposit
- Notice Period
- Lease Term (Months)
- Move-in Date
- Tenant(s) (names, as array if possible)
- Other Occupants (names and relationships, as array if possible)
- Vehicles Allowed (year, make, model, plate; as array of objects)
- Animals Allowed (type, breed, name, etc; as array of objects)
- Animal Deposit
- Monthly Pet Rent
- Pet Violation Fee
- Late Fees (initial and daily, as object if possible)
- Pet Policy (as object if detailed)
- Renter’s Insurance Required (yes/no)
- Insurance Minimum Coverage (amount)
- Utilities Paid by Tenant (as array)
- Utilities Paid by Landlord (as array)
- Returned Check Fee
- Application Fee
- Admin/Move-in Fee
- Expedite Processing Fee
- Amendment Fee
- HOA/Community Fee
- No Smoking Policy
- Move-out Carpet Cleaning Required
- Quarterly Inspections (yes/no/details)
- Showings During Final Lease Days
- Cash Payment Allowed (yes/no)
- Any other notable addenda or policy

Return the results as a **valid JSON object**. For array fields (tenants, occupants, vehicles, animals, utilities), use arrays or objects as appropriate. Only include fields found in the lease.

**Respond ONLY with a valid JSON object. Do not include any commentary or markdown code block.**

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
