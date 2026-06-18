export interface EmailMessage {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}
export interface EmailDeliveryResult {
    provider: 'log' | 'smtp' | 'resend' | 'gmail_api' | 'gas_webhook';
    attempted: boolean;
    sent: boolean;
    message: string;
    error?: string;
}
export interface IEmailProvider {
    send(message: EmailMessage): Promise<EmailDeliveryResult>;
}
export declare class EmailService {
    private readonly provider;
    constructor();
    sendLeaveNotification(opts: {
        recipientEmail: string;
        employeeName: string;
        status: 'approved' | 'rejected';
        reason?: string;
        leaveApplicationID: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        reviewerName: string;
        reviewedAt: Date;
    }): Promise<EmailDeliveryResult>;
    sendTimesheetNotification(opts: {
        recipientEmail: string;
        employeeName: string;
        month: number;
        year: number;
        status: 'submitted' | 'approved' | 'rejected';
        reason?: string;
    }): Promise<EmailDeliveryResult>;
    sendCorrectionNotification(opts: {
        recipientEmail: string;
        employeeName: string;
        status: 'approved' | 'rejected';
        reason?: string;
        correctionID: string;
        date: string;
        oldCheckIn: string;
        oldCheckOut: string;
        proposedCheckIn: string;
        proposedCheckOut: string;
        createdAt: Date;
        reviewerName: string;
        reviewedAt: Date;
    }): Promise<EmailDeliveryResult>;
    send(message: EmailMessage): Promise<EmailDeliveryResult>;
}
