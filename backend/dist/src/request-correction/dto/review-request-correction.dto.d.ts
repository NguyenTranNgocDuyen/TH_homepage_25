import { TimesheetStatus } from '@prisma/client';
export declare class ReviewRequestCorrectionDto {
    status: TimesheetStatus;
    reasonReject?: string;
}
