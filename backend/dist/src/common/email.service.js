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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const env_1 = require("./env");
class LogEmailProvider {
    logger = new common_1.Logger('EmailService[log-provider]');
    send(message) {
        const recipients = Array.isArray(message.to)
            ? message.to.join(', ')
            : message.to;
        this.logger.log(`[NO-OP EMAIL] To: ${recipients} | Subject: "${message.subject}" | Body: ${(message.text ?? message.html ?? '').slice(0, 120)}`);
        return Promise.resolve({
            provider: 'log',
            attempted: false,
            sent: false,
            message: 'EMAIL_LOGGED_ONLY',
        });
    }
}
class SmtpEmailProvider {
    logger = new common_1.Logger('EmailService[smtp-provider]');
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env_1.ENV.EMAIL.SMTP_HOST,
            port: env_1.ENV.EMAIL.SMTP_PORT,
            secure: env_1.ENV.EMAIL.SMTP_PORT === 465,
            auth: {
                user: env_1.ENV.EMAIL.SMTP_USER,
                pass: env_1.ENV.EMAIL.SMTP_PASS,
            },
        });
    }
    async send(message) {
        const recipients = Array.isArray(message.to)
            ? message.to.join(', ')
            : message.to;
        try {
            await this.transporter.sendMail({
                from: env_1.ENV.EMAIL.SMTP_FROM,
                to: message.to,
                subject: message.subject,
                text: message.text,
                html: message.html,
            });
            this.logger.log(`Email sent successfully to ${recipients}`);
            return {
                provider: 'smtp',
                attempted: true,
                sent: true,
                message: 'EMAIL_SENT',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send email to ${recipients}`, error);
            return {
                provider: 'smtp',
                attempted: true,
                sent: false,
                message: 'EMAIL_SEND_FAILED',
                error: errorMessage,
            };
        }
    }
}
class ResendEmailProvider {
    logger = new common_1.Logger('EmailService[resend-provider]');
    async send(message) {
        const recipients = Array.isArray(message.to)
            ? message.to.join(', ')
            : message.to;
        const fromAddress = env_1.ENV.EMAIL.SMTP_FROM &&
            env_1.ENV.EMAIL.SMTP_FROM !== '"HRM System" <no-reply@hrm.com>'
            ? env_1.ENV.EMAIL.SMTP_FROM
            : 'HRM System <onboarding@resend.dev>';
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${env_1.ENV.EMAIL.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: fromAddress,
                    to: Array.isArray(message.to) ? message.to : [message.to],
                    subject: message.subject,
                    text: message.text,
                    html: message.html,
                }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                this.logger.error(`Resend API error response: ${errorData}`);
                return {
                    provider: 'resend',
                    attempted: true,
                    sent: false,
                    message: 'EMAIL_SEND_FAILED',
                    error: `Resend API returned status ${response.status}: ${errorData}`,
                };
            }
            const resJson = (await response.json());
            this.logger.log(`Email sent successfully via Resend to ${recipients}. ID: ${resJson?.id}`);
            return {
                provider: 'resend',
                attempted: true,
                sent: true,
                message: 'EMAIL_SENT',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send email via Resend to ${recipients}`, error);
            return {
                provider: 'resend',
                attempted: true,
                sent: false,
                message: 'EMAIL_SEND_FAILED',
                error: errorMessage,
            };
        }
    }
}
class GmailApiEmailProvider {
    logger = new common_1.Logger('EmailService[gmail-api-provider]');
    async getAccessToken() {
        const clientId = env_1.ENV.EMAIL.GMAIL?.CLIENT_ID;
        const clientSecret = env_1.ENV.EMAIL.GMAIL?.CLIENT_SECRET;
        const refreshToken = env_1.ENV.EMAIL.GMAIL?.REFRESH_TOKEN;
        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error('Thiếu GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET hoặc GMAIL_REFRESH_TOKEN');
        }
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }).toString(),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to refresh Gmail access token: ${response.status} - ${errorText}`);
        }
        const data = (await response.json());
        return data.access_token;
    }
    async send(message) {
        const recipients = Array.isArray(message.to)
            ? message.to.join(', ')
            : message.to;
        const fromAddress = env_1.ENV.EMAIL.SMTP_FROM || '"HRM System" <no-reply@hrm.com>';
        try {
            const accessToken = await this.getAccessToken();
            const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;
            const headers = [
                `From: ${fromAddress}`,
                `To: ${recipients}`,
                `Subject: =?utf-8?B?${Buffer.from(message.subject).toString('base64')}?=`,
                'MIME-Version: 1.0',
                `Content-Type: multipart/alternative; boundary="${boundary}"`,
                '',
            ];
            const bodyParts = [];
            if (message.text) {
                bodyParts.push(`--${boundary}`, 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: base64', '', Buffer.from(message.text).toString('base64'));
            }
            if (message.html) {
                bodyParts.push(`--${boundary}`, 'Content-Type: text/html; charset=utf-8', 'Content-Transfer-Encoding: base64', '', Buffer.from(message.html).toString('base64'));
            }
            else if (!message.text && !message.html) {
                bodyParts.push(`--${boundary}`, 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: base64', '', '');
            }
            bodyParts.push(`--${boundary}--`);
            const rawMime = [...headers, ...bodyParts].join('\r\n');
            const base64UrlSafe = Buffer.from(rawMime).toString('base64url');
            const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raw: base64UrlSafe,
                }),
            });
            if (!sendResponse.ok) {
                const errorData = await sendResponse.text();
                this.logger.error(`Gmail API error response: ${errorData}`);
                return {
                    provider: 'gmail_api',
                    attempted: true,
                    sent: false,
                    message: 'EMAIL_SEND_FAILED',
                    error: `Gmail API returned status ${sendResponse.status}: ${errorData}`,
                };
            }
            const resJson = (await sendResponse.json());
            this.logger.log(`Email sent successfully via Gmail API to ${recipients}. ID: ${resJson?.id}`);
            return {
                provider: 'gmail_api',
                attempted: true,
                sent: true,
                message: 'EMAIL_SENT',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send email via Gmail API to ${recipients}`, error);
            return {
                provider: 'gmail_api',
                attempted: true,
                sent: false,
                message: 'EMAIL_SEND_FAILED',
                error: errorMessage,
            };
        }
    }
}
class GasWebhookEmailProvider {
    logger = new common_1.Logger('EmailService[gas-webhook-provider]');
    async send(message) {
        const recipients = Array.isArray(message.to)
            ? message.to.join(', ')
            : message.to;
        try {
            const htmlContent = message.html ||
                (message.text ? message.text.replace(/\n/g, '<br>') : '');
            const response = await fetch(env_1.ENV.EMAIL.GAS_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: recipients,
                    subject: message.subject,
                    text: message.text || '',
                    html: htmlContent,
                }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                this.logger.error(`GAS Webhook HTTP error: ${errorData}`);
                return {
                    provider: 'gas_webhook',
                    attempted: true,
                    sent: false,
                    message: 'EMAIL_SEND_FAILED',
                    error: `HTTP ${response.status}: ${errorData}`,
                };
            }
            const resData = (await response.json().catch(() => null));
            if (resData && resData.success === false) {
                this.logger.error(`GAS Webhook logical error: ${resData.message}`);
                return {
                    provider: 'gas_webhook',
                    attempted: true,
                    sent: false,
                    message: 'EMAIL_SEND_FAILED',
                    error: `GAS Error: ${resData.message}`,
                };
            }
            this.logger.log(`Email sent successfully via GAS Webhook to ${recipients}. GAS Response: ${JSON.stringify(resData)}`);
            return {
                provider: 'gas_webhook',
                attempted: true,
                sent: true,
                message: 'EMAIL_SENT',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send email via GAS Webhook to ${recipients}`, error);
            return {
                provider: 'gas_webhook',
                attempted: true,
                sent: false,
                message: 'EMAIL_SEND_FAILED',
                error: errorMessage,
            };
        }
    }
}
let EmailService = class EmailService {
    provider;
    constructor() {
        const emailProvider = env_1.ENV.EMAIL.PROVIDER;
        if (emailProvider === 'smtp') {
            if (!env_1.ENV.EMAIL.SMTP_HOST ||
                !env_1.ENV.EMAIL.SMTP_USER ||
                !env_1.ENV.EMAIL.SMTP_PASS) {
                new common_1.Logger('EmailService').warn('SMTP_HOST, SMTP_USER hoặc SMTP_PASS thiếu. Fallback về log-provider.');
                this.provider = new LogEmailProvider();
            }
            else {
                this.provider = new SmtpEmailProvider();
            }
        }
        else if (emailProvider === 'resend') {
            if (!env_1.ENV.EMAIL.RESEND_API_KEY) {
                new common_1.Logger('EmailService').warn('RESEND_API_KEY thiếu. Fallback về log-provider.');
                this.provider = new LogEmailProvider();
            }
            else {
                this.provider = new ResendEmailProvider();
            }
        }
        else if (emailProvider === 'gmail_api') {
            if (!env_1.ENV.EMAIL.GMAIL?.CLIENT_ID ||
                !env_1.ENV.EMAIL.GMAIL?.CLIENT_SECRET ||
                !env_1.ENV.EMAIL.GMAIL?.REFRESH_TOKEN) {
                new common_1.Logger('EmailService').warn('GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET hoặc GMAIL_REFRESH_TOKEN thiếu. Fallback về log-provider.');
                this.provider = new LogEmailProvider();
            }
            else {
                this.provider = new GmailApiEmailProvider();
            }
        }
        else if (emailProvider === 'gas_webhook') {
            if (!env_1.ENV.EMAIL.GAS_WEBHOOK_URL) {
                new common_1.Logger('EmailService').warn('GAS_EMAIL_WEBHOOK_URL thiếu. Fallback về log-provider.');
                this.provider = new LogEmailProvider();
            }
            else {
                this.provider = new GasWebhookEmailProvider();
            }
        }
        else {
            if (emailProvider !== 'log') {
                new common_1.Logger('EmailService').warn(`EMAIL_PROVIDER="${emailProvider}" chưa được hỗ trợ. Dùng log-provider.`);
            }
            this.provider = new LogEmailProvider();
        }
    }
    async sendLeaveNotification(opts) {
        const statusText = opts.status === 'approved' ? 'đã được duyệt' : 'đã bị từ chối';
        const formatDate = (date) => date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const formatDateTime = (date) => date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const workResumeDate = new Date(opts.endDate);
        workResumeDate.setDate(workResumeDate.getDate() + 1);
        if (workResumeDate.getDay() === 6) {
            workResumeDate.setDate(workResumeDate.getDate() + 2);
        }
        else if (workResumeDate.getDay() === 0) {
            workResumeDate.setDate(workResumeDate.getDate() + 1);
        }
        const textBody = `Xin chào ${opts.employeeName},\n\nĐơn xin nghỉ phép của bạn ${statusText}.\n${opts.status === 'rejected' && opts.reason ? `Lý do từ chối: ${opts.reason}\n\n` : '\n'}Thông tin chi tiết:\n- Loại đơn: Đơn xin nghỉ phép\n- Mã đơn: ${opts.leaveApplicationID}\n- Thời gian tạo: ${formatDateTime(opts.createdAt)}\n- Ngày nghỉ: Từ ngày ${formatDate(opts.startDate)} đến ngày ${formatDate(opts.endDate)}\n- Ngày bắt đầu làm việc: ${formatDate(workResumeDate)}\n- Người duyệt: ${opts.reviewerName}\n- Thời gian duyệt: ${formatDateTime(opts.reviewedAt)}\n\nTrân trọng,\nHệ thống HRM`;
        const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Xin chào ${opts.employeeName},</h2>
        <p>Đơn xin nghỉ phép của bạn <strong>${statusText}</strong>.</p>
        ${opts.status === 'rejected' && opts.reason ? `<p><strong>Lý do từ chối:</strong> <span style="color: red;">${opts.reason}</span></p>` : ''}
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Thông tin chi tiết:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 8px;"><strong>Loại đơn:</strong> Đơn xin nghỉ phép</li>
            <li style="margin-bottom: 8px;"><strong>Mã đơn:</strong> ${opts.leaveApplicationID}</li>
            <li style="margin-bottom: 8px;"><strong>Thời gian tạo:</strong> ${formatDateTime(opts.createdAt)}</li>
            <li style="margin-bottom: 8px;"><strong>Ngày nghỉ:</strong> Từ ngày ${formatDate(opts.startDate)} đến ngày ${formatDate(opts.endDate)}</li>
            <li style="margin-bottom: 8px;"><strong>Ngày bắt đầu làm việc:</strong> ${formatDate(workResumeDate)}</li>
            <li style="margin-bottom: 8px;"><strong>Người duyệt:</strong> ${opts.reviewerName}</li>
            <li style="margin-bottom: 8px;"><strong>Thời gian duyệt:</strong> ${formatDateTime(opts.reviewedAt)}</li>
          </ul>
        </div>
        
        <p>Trân trọng,<br><strong>Hệ thống HRM</strong></p>
      </div>
    `;
        return this.provider.send({
            to: opts.recipientEmail,
            subject: `[HRM] Đơn nghỉ phép của bạn ${statusText}`,
            text: textBody,
            html: htmlBody,
        });
    }
    async sendTimesheetNotification(opts) {
        const period = `${String(opts.month).padStart(2, '0')}/${opts.year}`;
        const statusText = opts.status === 'submitted'
            ? 'đã được gửi đi'
            : opts.status === 'approved'
                ? 'đã được duyệt'
                : 'đã bị từ chối';
        const reasonText = opts.reason ? ` Lý do: ${opts.reason}` : '';
        return this.provider.send({
            to: opts.recipientEmail,
            subject: `[HRM] Bảng công tháng ${period} ${statusText}`,
            text: `Xin chào ${opts.employeeName},\n\nBảng công tháng ${period} của bạn ${statusText}.${reasonText}\n\nTrân trọng,\nHệ thống HRM`,
        });
    }
    async sendCorrectionNotification(opts) {
        const statusText = opts.status === 'approved' ? 'đã được duyệt' : 'đã bị từ chối';
        const formatDateTime = (date) => date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const textBody = `Xin chào ${opts.employeeName},\n\nYêu cầu chỉnh sửa công của bạn ${statusText}.\n${opts.status === 'rejected' && opts.reason ? `Lý do từ chối: ${opts.reason}\n\n` : '\n'}Thông tin chi tiết:\n- Loại đơn: Yêu cầu chỉnh sửa công\n- Mã yêu cầu: ${opts.correctionID}\n- Ngày cần sửa: ${opts.date}\n- Giờ Check-in / Check-out cũ: ${opts.oldCheckIn} - ${opts.oldCheckOut}\n- Giờ Check-in / Check-out sửa đổi: ${opts.proposedCheckIn} - ${opts.proposedCheckOut}\n- Thời gian tạo: ${formatDateTime(opts.createdAt)}\n- Người duyệt: ${opts.reviewerName}\n- Thời gian duyệt: ${formatDateTime(opts.reviewedAt)}\n\nTrân trọng,\nHệ thống HRM`;
        const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Xin chào ${opts.employeeName},</h2>
        <p>Yêu cầu chỉnh sửa công của bạn <strong>${statusText}</strong>.</p>
        ${opts.status === 'rejected' && opts.reason ? `<p><strong>Lý do từ chối:</strong> <span style="color: red;">${opts.reason}</span></p>` : ''}
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Thông tin chi tiết:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 8px;"><strong>Loại đơn:</strong> Yêu cầu chỉnh sửa công</li>
            <li style="margin-bottom: 8px;"><strong>Mã yêu cầu:</strong> ${opts.correctionID}</li>
            <li style="margin-bottom: 8px;"><strong>Ngày cần sửa:</strong> ${opts.date}</li>
            <li style="margin-bottom: 8px;"><strong>Giờ Check-in / Check-out cũ:</strong> ${opts.oldCheckIn} - ${opts.oldCheckOut}</li>
            <li style="margin-bottom: 8px;"><strong>Giờ Check-in / Check-out sửa đổi:</strong> ${opts.proposedCheckIn} - ${opts.proposedCheckOut}</li>
            <li style="margin-bottom: 8px;"><strong>Thời gian tạo:</strong> ${formatDateTime(opts.createdAt)}</li>
            <li style="margin-bottom: 8px;"><strong>Người duyệt:</strong> ${opts.reviewerName}</li>
            <li style="margin-bottom: 8px;"><strong>Thời gian duyệt:</strong> ${formatDateTime(opts.reviewedAt)}</li>
          </ul>
        </div>
        
        <p>Trân trọng,<br><strong>Hệ thống HRM</strong></p>
      </div>
    `;
        return this.provider.send({
            to: opts.recipientEmail,
            subject: `[HRM] Yêu cầu chỉnh sửa công của bạn ${statusText}`,
            text: textBody,
            html: htmlBody,
        });
    }
    async send(message) {
        return this.provider.send(message);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map