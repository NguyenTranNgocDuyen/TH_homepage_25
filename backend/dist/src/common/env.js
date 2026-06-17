"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    DATABASE: {
        URL: process.env.DATABASE_URL,
        DIRECT_URL: process.env.DIRECT_URL,
        PORT: parseInt(process.env.DB_PORT || '5432', 10),
    },
    JWT: {
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'TIMESHEETSYSTEM_ACCESSSECRET',
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'TIMESHEETSYSTEM_REFRESHSECRET',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
        REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    },
    MICROSOFT: {
        CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
        CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
        TENANT_ID: process.env.MICROSOFT_TENANT_ID,
        CALLBACK_URL: process.env.MICROSOFT_CALLBACK_URL,
        SCOPES: process.env.MICROSOFT_SCOPES || 'openid profile email User.Read',
    },
    SSO: {
        SUCCESS_REDIRECT_URL: process.env.SSO_SUCCESS_REDIRECT_URL,
        ERROR_REDIRECT_URL: process.env.SSO_ERROR_REDIRECT_URL,
    },
    EMAIL: {
        PROVIDER: process.env.EMAIL_PROVIDER || 'log',
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_FROM: process.env.SMTP_FROM || '"HRM System" <no-reply@hrm.com>',
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        GAS_WEBHOOK_URL: process.env.GAS_EMAIL_WEBHOOK_URL,
        GMAIL: {
            CLIENT_ID: process.env.GMAIL_CLIENT_ID,
            CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
            REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
        },
    },
};
//# sourceMappingURL=env.js.map