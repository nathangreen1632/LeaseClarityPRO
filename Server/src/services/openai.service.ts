import {OpenAI} from 'openai';

type TenantRightsConcern = {
  category: string;
  issue: string;
  severity?: 'low' | 'medium' | 'high';
  sourceClause?: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractFirstJsonObject(text: string): string | null {
  const firstBrace: number = text.indexOf('{');
  if (firstBrace === -1) return null;
  let open: number = 0;
  for (let i: number = firstBrace; i < text.length; i++) {
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

export const summarizeLease: (text: string) => Promise<any> = async (text: string): Promise<any> => {
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

    const content: string | null = completion.choices[0].message.content;
    let cleanedContent: string = (content ?? '').replace(/```(?:json)?/gi, '').trim();
    const jsonStr: string | null = extractFirstJsonObject(cleanedContent);

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

export const humanReadableLeaseSummary: (text: string) => Promise<any> = async (text: string): Promise<any> => {
  const prompt = `
You are a friendly expert assistant. Please summarize the following lease agreement for a tenant in clear, easy-to-understand language. **Write ONLY in plain English. Do NOT use any markdown, bold, italics, asterisks, bullet points, or other formatting. Do NOT use numbered or bulleted lists. Write in clear sentences and paragraphs, separating topics with new lines if needed.**

Lease Agreement:
${text}
`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You summarize leases for tenants in plain language.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    });

    const content: string | undefined = completion.choices[0].message.content?.trim();
    if (!content) {
      return {
        error: true,
        message: 'No summary text returned by OpenAI.',
      };
    }
    const noMarkdown: string = content
      .replace(/[*_`>#-]/g, '')
      .replace(/\n{2,}/g, '\n\n')
      .replace(/ +/g, ' ');
    return { summary: noMarkdown.trim() };
  } catch (apiErr) {
    return {
      error: true,
      message: 'OpenAI API call failed.',
      details: apiErr instanceof Error ? apiErr.message : apiErr,
    };
  }
};

export const askQuestionAboutLease = async (leaseText: string, question: string) => {
  const prompt = `
You are a lease agreement assistant. You will only answer questions based on the lease text.

Do not speculate. If the question is off-topic or irrelevant to leases, reply that you cannot answer.

Please format your answer in **clearly separated sections**, using this structure:

Clause Title:
Explanation sentence one. Explanation sentence two.

If a clause (like "Animals", "Community Policies", "Parking Policies", "Payments", etc...) includes **multiple policies or rules**, split it into **sub-clauses** using appropriate titles like:

Animal Permission:
[explanation]

Animal Removal:
[explanation]

Animal Violation Fees:
[explanation]

Always begin each section with a capitalized title followed by a colon. Leave a **blank line between sections**. This formatting is required so each policy can be shown separately in the UI.


Lease text:
${leaseText}

Question:
${question}

Answer:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are a legal assistant that answers only lease-related questions. Format answers with clause titles followed by explanation, with a blank line between sections.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawContent: string | undefined = completion.choices[0].message.content?.trim();
    if (!rawContent) return { error: true, message: 'No answer returned.' };

    const cleaned: string = rawContent
      .replace(/[*_`>#]/g, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/(?:^|\n)([A-Z][\w/()'’\- ]{3,90}):/g, '\n\n$1:')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ +/g, ' ')
      .trim();

    return { answer: cleaned };
  } catch (err) {
    return { error: true, message: 'OpenAI API call failed', details: err };
  }
};

export const analyzeLegalConcerns = async (
  leaseText: string,
  state: string
): Promise<TenantRightsConcern[]> => {
  const prompt = `
You are an expert in U.S. tenant rights, lease law, and landlord-tenant power imbalances.

Your job is to analyze the following residential lease agreement and list **every clause, statement, or requirement** that:

- Violates or appears to violate tenant rights in the state of ${state}
- Shifts legal or financial risk unfairly onto the tenant
- Grants excessive power or discretion to the landlord
- Imposes excessive fees, unclear penalties, or restrictive requirements
- Uses vague, misleading, or coercive language
- Reduces tenant privacy, autonomy, or access to justice

🚨 You must be THOROUGH. Identify **all potential issues**, even if minor. This may include:
- Privacy violations (e.g., forced showings, quarterly inspections)
- Nonrefundable or deceptive fees (e.g., application, expedite, admin, pet)
- One-sided indemnification clauses
- Arbitrary pet or guest restrictions
- Unclear lease termination penalties
- Mandatory services that may not be legally enforceable
- Waivers of landlord liability or tenant legal rights

📌 Format your response as a JSON array of objects, each with a "category" and an "issue" field. Be specific and consistent with category labels.

Only include actual written clauses or inferred implications from the lease. Do not speculate or generalize. Do not use numbers or bullet symbols.

Example format:
[
  {
    "category": "Excessive Fee",
    "issue": "Late fees of $100 initial and $75 per day are excessive and may violate state laws."
  },
  {
    "category": "Privacy Violation",
    "issue": "Quarterly inspections may infringe on tenant privacy without cause."
  }
]

Lease:
${leaseText}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert on U.S. tenant rights and lease violations. Be extremely thorough and risk-aware in all responses.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || '';

    if (!raw) {
      console.error('❌ OpenAI returned an empty response.');
      return [
        {
          category: 'Error',
          issue: 'No response received from AI.',
        },
      ];
    }

    const firstBracket = raw.indexOf('[');
    const lastBracket = raw.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1 || firstBracket > lastBracket) {
      console.error('❌ Could not locate valid JSON array in OpenAI response:', raw);
      return [
        {
          category: 'Error',
          issue: 'AI returned invalid format. Please try again.',
        },
      ];
    }

    const jsonStr = raw.slice(firstBracket, lastBracket + 1);

    try {
      const parsed: TenantRightsConcern[] = JSON.parse(jsonStr);
      return parsed.filter((item) => item.category && item.issue);
    } catch (parseErr) {
      console.error('❌ JSON parsing failed. Raw content:', jsonStr);
      return [
        {
          category: 'Error',
          issue: 'Unable to parse AI response. Try regenerating.',
        },
      ];
    }
  } catch (err) {
    console.error('❌ OpenAI request failed in analyzeLegalConcerns:', err);
    return [
      {
        category: 'Error',
        issue: 'Error communicating with AI. Please try again later.',
      },
    ];
  }
};

