import { OnModuleInit } from '@nestjs/common';
import { BycyptHashedService } from "./bycypt-hashed/bycypt-hashed.service";
import { PrismaService } from "../prisma/prisma.service";
interface SeedOptions {
    force?: boolean;
}
export declare class SeedService implements OnModuleInit {
    private readonly prisma;
    private readonly bcrypt;
    private readonly logger;
    constructor(prisma: PrismaService, bcrypt: BycyptHashedService);
    onModuleInit(): Promise<void>;
    seedDemoData(options?: SeedOptions): Promise<void>;
    private isDatabaseEmpty;
    private getPreviousMonthPeriod;
    private seedRoles;
    private seedDepartments;
    private seedLeaveTypes;
    private seedUsers;
    private upsertUser;
    private assignDepartmentManagers;
    private seedMonthlyTimesheets;
    private upsertMonthlyTimesheet;
    private seedTimesheetEntries;
    private seedPayrolls;
    private upsertPayroll;
    private seedLeaveApplications;
    private upsertLeaveApplication;
    private seedNotifications;
    private upsertNotification;
    private mergeLegacyDepartments;
    private mergeLegacyLeaveTypes;
    private cleanupLegacySeedData;
    private deleteRoleIfUnused;
    private deleteLegacyAdminIfUnused;
    private getBusinessDays;
    private fixedDate;
    private withTime;
    private formatDateKey;
}
export {};
