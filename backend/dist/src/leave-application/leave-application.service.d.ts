import { PrismaService } from "../prisma/prisma.service";
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { ReviewLeaveApplicationDto } from './dto/review-leave-application.dto';
import { DefaultResponse } from "../common/response.dto";
import { NotificationService } from "../notification/notification.service";
import { EmailService } from "../common/email.service";
export declare class LeaveApplicationService {
    private readonly prisma;
    private readonly notificationService;
    private readonly emailService;
    constructor(prisma: PrismaService, notificationService: NotificationService, emailService: EmailService);
    createLeaveApplication(userID: string, createDto: CreateLeaveApplicationDto): Promise<DefaultResponse>;
    getMyLeaveApplications(userID: string): Promise<DefaultResponse>;
    getDepartmentLeaveApplications(departmentID: string): Promise<DefaultResponse>;
    getAllLeaveApplications(): Promise<DefaultResponse>;
    reviewLeaveApplication(leaveApplicationID: string, reviewerID: string, reviewDto: ReviewLeaveApplicationDto): Promise<DefaultResponse>;
    getLeaveBalance(userID: string): Promise<DefaultResponse>;
    private parseDateOnly;
    private startOfToday;
    private calculateBusinessDays;
    private findWorkLogConflictDates;
    private toDateKey;
    private formatDateVi;
}
