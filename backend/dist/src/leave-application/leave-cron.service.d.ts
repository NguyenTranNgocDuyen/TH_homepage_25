import { PrismaService } from "../prisma/prisma.service";
export declare class LeaveCronService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleAnnualLeaveReset(): Promise<void>;
}
