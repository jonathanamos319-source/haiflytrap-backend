import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';

// Load .env relative to server root first, then fallback to cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const isSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: smtpPort,
  secure: isSecure,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || '',
      }
    : undefined,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (options: EmailOptions) => {
  try {
    const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER || 'support@haiflytrapng.com';
    const mailOptions = {
      from: `Haifly Trap <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}:`, info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Error sending email via SMTP:', error);
    return { success: false, error };
  }
};

// Alias sendEmail to sendMail for compatibility
export const sendEmail = sendMail;
