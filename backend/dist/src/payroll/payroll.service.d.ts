import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from '@prisma/client';
import { DefaultResponse } from "../common/response.dto";
import * as ExcelJS from 'exceljs';
declare const payrollExportInclude: {
    employee: {
        select: {
            userID: true;
            username: true;
            email: true;
            salaryCoefficient: true;
            departmentID: true;
            department: {
                select: {
                    departmentID: true;
                    departmentName: true;
                };
            };
        };
    };
    monthlyTimesheet: {
        select: {
            monthlyTimesheetID: true;
            status: true;
            reviewedAt: true;
        };
    };
};
type PayrollExportRow = Prisma.PayrollGetPayload<{
    include: typeof payrollExportInclude;
}>;
type PayrollExportResult = (DefaultResponse & {
    data: string;
    isCsv: true;
    warnings?: string[];
}) | (DefaultResponse & {
    data: PayrollExportRow[];
    isCsv: false;
    meta?: PayrollExportMeta;
}) | (DefaultResponse & {
    isCsv?: false;
});
export interface IPayrollExporter {
    export(payrolls: PayrollExportRow[]): string;
}
export interface PayrollExportMeta {
    count: number;
    warnings: string[];
    externalIntegration: 'not_configured';
}
export interface IExternalPayrollExporter {
    providerName: string;
    export(payrolls: PayrollExportRow[]): Promise<{
        sent: boolean;
        message: string;
    }>;
}
export declare class NotConfiguredExternalPayrollExporter implements IExternalPayrollExporter {
    providerName: string;
    export(): Promise<{
        sent: boolean;
        message: string;
    }>;
}
export declare class PayrollService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generatePayroll(monthlyTimesheetID: string): Promise<DefaultResponse>;
    getMyPayroll(userID: string, month?: number, year?: number): Promise<DefaultResponse>;
    getDepartmentPayroll(departmentID: string, month?: number, year?: number): Promise<DefaultResponse>;
    exportPayroll(month?: number, year?: number, format?: string): Promise<PayrollExportResult>;
    exportPayrollExcel(month?: number, year?: number): Promise<ExcelJS.Workbook>;
    private validatePeriod;
    private buildExportWarnings;
}
export {};
