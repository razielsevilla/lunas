// ---------------------------------------------------------------------------
// SMS — Twilio stub with console.log fallback for demo
//
// Uses environment variables:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
//
// If Twilio credentials are not set, SMS is logged to console instead.
// This allows the full notification flow to work during development
// without requiring a live Twilio account.
// ---------------------------------------------------------------------------

interface SmsResult {
  success: boolean;
  sid?: string;
  fallback?: boolean;
}

/**
 * Sends an SMS message to the given phone number.
 *
 * @param to   - Recipient phone number in E.164 format (e.g. +639171234567).
 * @param body - SMS message body. Per SECURITY.md §7, must NEVER contain PHI.
 * @returns    - Result object with success status and optional SID.
 */
export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // ── Fallback: log to console if Twilio is not configured ──
  if (!accountSid || !authToken || !fromNumber || accountSid.startsWith('AC00')) {
    console.warn('[sms] Twilio not configured. SMS NOT sent to:', to);
    console.log('[sms] Body:', body);
    return { success: true, fallback: true };
  }

  // ── Live Twilio send ──
  try {
    // Dynamic import to avoid requiring twilio as a hard dependency
    // If twilio is not installed, falls back to console log
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: body,
    });

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[sms] Twilio API error:', response.status, errorBody);
      return { success: false };
    }

    const result = await response.json();
    console.log('[sms] SMS sent to %s — sid: %s', to, result.sid);
    return { success: true, sid: result.sid };
  } catch (err) {
    console.error('[sms] Failed to send SMS to', to, err);
    return { success: false };
  }
}
