import { PrismaService } from '../prisma/prisma.service';
export declare class SystemLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllLogs(limit?: number, skip?: number, startDate?: string, endDate?: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            logs: ({
                user: {
                    email: string;
                    username: string;
                    linkAvatar: string | null;
                } | null;
            } & {
                userID: string | null;
                statusCode: number | null;
                createdAt: Date;
                logID: string;
                action: string;
                entity: string | null;
                entityID: string | null;
                details: string | null;
                responseMessage: string | null;
                ipAddress: string | null;
                isAnomalous: boolean;
            })[];
            total: number;
            limit: number;
            skip: number;
        };
    }>;
    toggleAnomaly(logID: string): Promise<{
        statusCode: number;
        message: string;
        data?: undefined;
    } | {
        statusCode: number;
        message: string;
        data: {
            userID: string | null;
            statusCode: number | null;
            createdAt: Date;
            logID: string;
            action: string;
            entity: string | null;
            entityID: string | null;
            details: string | null;
            responseMessage: string | null;
            ipAddress: string | null;
            isAnomalous: boolean;
        };
    }>;
}
