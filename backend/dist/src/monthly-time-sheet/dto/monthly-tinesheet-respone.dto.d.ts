export declare class MonthlyTimesheeetResponeDto {
    monthlyTimesheetID: string;
    canSubmit: boolean;
    isSubmitted: boolean;
    status?: string;
    month?: number;
    year?: number;
    userID?: string;
    reasonReject?: string | null;
    reviewedAt?: Date | null;
}
