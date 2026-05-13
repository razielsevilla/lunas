import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Nodemailer SMTP transport (Gmail for hackathon/demo)
//
// Uses environment variables from .env:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// ---------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ---------------------------------------------------------------------------
// sendEmail
// ---------------------------------------------------------------------------

/**
 * Sends an email via SMTP.
 *
 * @param to      - Recipient email address.
 * @param subject - Email subject line.
 * @param body    - Plain-text email body.
 * @param html    - (Optional) HTML email body for rich formatting.
 * @returns       - Nodemailer send result, or null if sending fails.
 *
 * NOTE: Per SECURITY.md §7, notification emails must NEVER include PHI.
 * Only include: patient first name, timestamp, and generic access message.
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  html?: string
): Promise<nodemailer.SentMessageInfo | null> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      '[mailer] SMTP credentials not configured. Email NOT sent to:',
      to
    );
    console.log('[mailer] Subject:', subject);
    console.log('[mailer] Body:', body);
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
      ...(html ? { html } : {}),
    });

    console.log('[mailer] Email sent to %s — messageId: %s', to, info.messageId);
    return info;
  } catch (err) {
    console.error('[mailer] Failed to send email to', to, err);
    return null;
  }
}
