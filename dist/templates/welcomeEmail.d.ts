export interface WelcomeEmailData {
    name?: string | null;
    email: string;
}
export declare const getWelcomeEmailSubject: (name?: string | null) => string;
export declare const getWelcomeEmailHtml: (data: WelcomeEmailData) => string;
//# sourceMappingURL=welcomeEmail.d.ts.map