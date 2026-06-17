export declare const ENV: {
    NODE_ENV: string;
    PORT: number;
    CORS_ORIGIN: string;
    DATABASE: {
        URL: string | undefined;
        DIRECT_URL: string | undefined;
        PORT: number;
    };
    JWT: {
        ACCESS_SECRET: string;
        REFRESH_SECRET: string;
        EXPIRES_IN: string;
        REFRESH_EXPIRES_IN: string;
    };
    GOOGLE: {
        CLIENT_ID: string | undefined;
        CLIENT_SECRET: string | undefined;
        CALLBACK_URL: string | undefined;
    };
    MICROSOFT: {
        CLIENT_ID: string | undefined;
        CLIENT_SECRET: string | undefined;
        TENANT_ID: string | undefined;
        CALLBACK_URL: string | undefined;
        SCOPES: string;
    };
    SSO: {
        SUCCESS_REDIRECT_URL: string | undefined;
        ERROR_REDIRECT_URL: string | undefined;
    };
    EMAIL: {
        PROVIDER: string;
        SMTP_HOST: string | undefined;
        SMTP_PORT: number;
        SMTP_USER: string | undefined;
        SMTP_PASS: string | undefined;
        SMTP_FROM: string;
        RESEND_API_KEY: string | undefined;
        GAS_WEBHOOK_URL: string | undefined;
        GMAIL: {
            CLIENT_ID: string | undefined;
            CLIENT_SECRET: string | undefined;
            REFRESH_TOKEN: string | undefined;
        };
    };
};
