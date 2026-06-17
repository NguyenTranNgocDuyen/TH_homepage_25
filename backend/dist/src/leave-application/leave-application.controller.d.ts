import type { Request } from 'express';
import { RequestUser } from "../common/types";
import { LeaveApplicationService } from './leave-application.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { ReviewLeaveApplicationDto } from './dto/review-leave-application.dto';
import { DefaultResponse } from "../common/response.dto";
interface RequestWithUser extends Request {
    user?: RequestUser;
}
export declare class LeaveApplicationController {
    private readonly leaveApplicationService;
    constructor(leaveApplicationService: LeaveApplicationService);
    createLeaveApplication(userID: string, createDto: CreateLeaveApplicationDto): Promise<DefaultResponse>;
    getLeaveBalance(userID: string): Promise<DefaultResponse>;
    getMyLeaveApplications(userID: string): Promise<DefaultResponse>;
    getDepartmentLeaveApplications(departmentID: string): Promise<DefaultResponse>;
    getAllLeaveApplications(): Promise<DefaultResponse>;
    reviewLeaveApplication(leaveApplicationID: string, reviewDto: ReviewLeaveApplicationDto, req: RequestWithUser): Promise<DefaultResponse>;
}
export {};
