export async function verifyRecaptchaToken(
  token: string,
  expectedAction: string
): Promise<boolean> {
  const secret: string | undefined = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    console.warn('🚨 Missing RECAPTCHA_SECRET in environment variables.');
    return false;
  }

  const formBody = new URLSearchParams();
  formBody.append('secret', secret);
  formBody.append('response', token);

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    const data = await response.json();

    // ✅ Full logging no matter what
    console.log('🧠 [reCAPTCHA RAW DATA]', JSON.stringify(data, null, 2));

    const isScoreValid = data.success && data.score >= 0.5;
    const isActionMatch = data.action === expectedAction;

    if (!isScoreValid) {
      console.warn('❌ reCAPTCHA failed score or validity check:', {
        success: data.success,
        score: data.score,
        errors: data['error-codes'],
      });
      return false;
    }

    if (!isActionMatch) {
      console.warn(`⚠️ reCAPTCHA action mismatch: expected "${expectedAction}", got "${data.action}"`);
      // Optionally allow this through for now:
      // return false;
    }

    return true;
  } catch (err) {
    console.error('🔥 Error verifying reCAPTCHA:', err);
    return false;
  }
}
