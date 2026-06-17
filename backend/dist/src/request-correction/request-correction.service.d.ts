import { Prisma } from '@prisma/client';
import { TimesheetStatus } from '@prisma/client';
import { DefaultResponse } from "../common/response.dto";
import { NotificationService } from "../notification/notification.service";
import { EmailService } from "../common/email.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRequestCorrectionDto } from './dto/create-request-correction.dto';
import { ReviewRequestCorrectionDto } from './dto/review-request-correction.dto';
export declare class RequestCorrectionService {
    private readonly prisma;
    private readonly notificationService;
    private readonly emailService;
    constructor(prisma: PrismaService, notificationService: NotificationService, emailService: EmailService);
    createRequest(userID: string, dto: CreateRequestCorrectionDto): Promise<DefaultResponse>;
    getDepartmentRequests(departmentID: string, status?: TimesheetStatus): Promise<DefaultResponse>;
    getMyRequests(userID: string): Promise<DefaultResponse>;
    reviewRequest(requestCorrectionID: string, reviewerID: string, dto: ReviewRequestCorrectionDto): Promise<DefaultResponse>;
    recalculateCanSubmit(monthlyTimesheetID: string, tx?: Prisma.TransactionClient): Promise<boolean>;
    private canReviewRequest;
    private applyApprovedCorrection;
    private parseProposedDateTime;
    private defaultInclude;
}
