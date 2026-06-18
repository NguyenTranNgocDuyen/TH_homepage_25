import type { Request } from 'express';
import { DefaultResponse } from "../common/response.dto";
import { CreateRequestCorrectionDto } from './dto/create-request-correction.dto';
import { ReviewRequestCorrectionDto } from './dto/review-request-correction.dto';
import { RequestCorrectionService } from './request-correction.service';
interface RequestWithUser extends Request {
    user?: {
        userID?: string;
    };
}
export declare class RequestCorrectionController {
    private readonly requestCorrectionService;
    constructor(requestCorrectionService: RequestCorrectionService);
    createCorrection(userID: string, dto: CreateRequestCorrectionDto): Promise<DefaultResponse>;
    getMyCorrections(userID: string): Promise<DefaultResponse>;
    getDepartmentCorrections(departmentID: string, status?: string): Promise<DefaultResponse>;
    reviewCorrection(requestCorrectionID: string, dto: ReviewRequestCorrectionDto, request: RequestWithUser): Promise<DefaultResponse>;
    private parseTimesheetStatus;
    private returnOrThrow;
}
export {};
