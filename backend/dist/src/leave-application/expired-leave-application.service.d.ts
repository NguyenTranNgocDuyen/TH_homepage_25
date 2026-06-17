import { OnModuleInit } from '@nestjs/common';
import { NotificationService } from "../notification/notification.service";
import { PrismaService } from "../prisma/prisma.service";
export declare class ExpiredLeaveApplicationService implements OnModuleInit {
    private readonly prisma;
    private readonly notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    onModuleInit(): Promise<void>;
    cancelPendingLeavesAtEndOfDay(): Promise<void>;
    cancelOverduePendingLeaves(cutoff: Date, source?: string): Promise<number>;
    private endOfToday;
    private endOfYesterday;
    private formatDateKey;
}
