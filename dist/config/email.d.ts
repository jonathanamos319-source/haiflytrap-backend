export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare const sendMail: (options: EmailOptions) => Promise<{
    success: boolean;
    data: import("nodemailer/lib/smtp-transport").SentMessageInfo;
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    data?: undefined;
}>;
export declare const sendEmail: (options: EmailOptions) => Promise<{
    success: boolean;
    data: import("nodemailer/lib/smtp-transport").SentMessageInfo;
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    data?: undefined;
}>;
//# sourceMappingURL=email.d.ts.map