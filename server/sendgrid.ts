import sgMail from '@sendgrid/mail';

/**
 * SendGrid メール送信ヘルパー
 */

let isInitialized = false;

function initializeSendGrid() {
  if (!isInitialized && process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    isInitialized = true;
  }
}

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * SendGridを使用してメールを送信
 */
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    initializeSendGrid();

    if (!process.env.SENDGRID_API_KEY) {
      console.error('[SendGrid] SENDGRID_API_KEY is not set');
      return false;
    }

    const msg = {
      to: params.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@anyenv-inc.com',
      subject: params.subject,
      text: params.text,
      html: params.html || params.text,
    };

    await sgMail.send(msg);
    console.log('[SendGrid] Email sent successfully to:', params.to);
    return true;
  } catch (error) {
    console.error('[SendGrid] Failed to send email:', error);
    return false;
  }
}
