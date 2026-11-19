export interface WelcomeUser {
    id: string;
    email: string;
    name?: string | null;
}
/**
 * Sends a welcome email to a single user and marks them as sent in the database.
 */
export declare function sendWelcomeEmailToUser(user: WelcomeUser): Promise<boolean>;
/**
 * Main cron job runner to process pending welcome emails.
 */
export declare function runWelcomeEmailCron(limit?: number): Promise<{
    processed: number;
    sent: number;
}>;
//# sourceMappingURL=sendWelcomeEmails.d.ts.map