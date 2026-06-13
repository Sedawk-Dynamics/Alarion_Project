/**
 * Notification dispatcher (architecture.md /services notification dispatcher).
 * These are thin wrappers — swap the bodies for a real email/SMS provider
 * (e.g. SendGrid/SES for email, Twilio/MSG91 for SMS).
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  // TODO: integrate email provider (SendGrid / AWS SES / Nodemailer)
  console.log(`[email] -> ${payload.to} | ${payload.subject}`);
}

export async function sendSms(phone: string, message: string): Promise<void> {
  // TODO: integrate SMS provider (Twilio / MSG91)
  console.log(`[sms] -> ${phone} | ${message}`);
}
