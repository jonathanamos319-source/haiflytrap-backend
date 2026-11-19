"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env relative to server root first, then fallback to cwd
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const isSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465;
const transporter = nodemailer_1.default.createTransport({
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
const sendMail = async (options) => {
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
    }
    catch (error) {
        console.error('Error sending email via SMTP:', error);
        return { success: false, error };
    }
};
exports.sendMail = sendMail;
// Alias sendEmail to sendMail for compatibility
exports.sendEmail = exports.sendMail;
//# sourceMappingURL=email.js.map