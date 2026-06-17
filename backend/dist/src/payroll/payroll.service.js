"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PayrollService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = exports.NotConfiguredExternalPayrollExporter = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const excel_helper_1 = require("../common/excel.helper");
const code_1 = require("../common/code");
const LARGE_EXPORT_WARNING_THRESHOLD = 5000;
const payrollExportInclude = client_1.Prisma.validator()({
    employee: {
        select: {
            userID: true,
            username: true,
            email: true,
            salaryCoefficient: true,
            departmentID: true,
            department: { select: { departmentID: true, departmentName: true } },
        },
    },
    monthlyTimesheet: {
        select: {
            monthlyTimesheetID: true,
            status: true,
            reviewedAt: true,
        },
    },
});
class NotConfiguredExternalPayrollExporter {
    providerName = 'not_configured';
    export() {
        return Promise.resolve({
            sent: false,
            message: 'External payroll integration is not configured. Current scope supports CSV, Excel and JSON export only.',
        });
    }
}
exports.NotConfiguredExternalPayrollExporter = NotConfiguredExternalPayrollExporter;
class CsvPayrollExporter {
    export(payrolls) {
        const header = [
            'Payroll ID',
            'User Name',
            'Email',
            'Department',
            'Month',
            'Year',
            'Total Hours',
            'Total Extra Hours',
            'Total Salary',
        ].join(',');
        const rows = payrolls.map((p) => {
            return [
                p.payrollID,
                p.employee?.username || '',
                p.employee?.email || '',
                p.employee?.department?.departmentName || '',
                p.month,
                p.year,
                p.totalHours.toFixed(2),
                p.totalExtraHours.toFixed(2),
                p.totalSalaryByHours.toFixed(2),
            ]
                .map((field) => this.escapeCsv(field))
                .join(',');
        });
        return [header, ...rows].join('\n');
    }
    escapeCsv(value) {
        return `"${String(value).replace(/"/g, '""')}"`;
    }
}
let PayrollService = PayrollService_1 = class PayrollService {
    prisma;
    logger = new common_1.Logger(PayrollService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePayroll(monthlyTimesheetID) {
        try {
            const timesheet = await this.prisma.monthlyTimesheet.findUnique({
                where: { monthlyTimesheetID },
                include: {
                    entries: true,
                    employee: true,
                },
            });
            if (!timesheet) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Monthly timesheet not found',
                };
            }
            if (timesheet.status !== client_1.MonthlyTimesheetStatus.APPROVED) {
                return {
                    statusCode: code_1.CONFLIG_CODE,
                    message: 'Can only generate payroll for approved timesheets',
                };
            }
            const existingPayroll = await this.prisma.payroll.findFirst({
                where: { monthlyTimesheetID },
            });
            if (existingPayroll) {
                return {
                    statusCode: code_1.CONFLIG_CODE,
                    message: 'Payroll for this timesheet already generated',
                };
            }
            let totalHours = 0;
            let totalExtraHours = 0;
            for (const entry of timesheet.entries) {
                if (entry.status === client_1.TimesheetStatus.APPROVED && entry.checkOut) {
                    const checkIn = new Date(entry.checkIn);
                    const checkOut = new Date(entry.checkOut);
                    const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                    if (hours > 8) {
                        totalHours += 8;
                        totalExtraHours += hours - 8;
                    }
                    else {
                        totalHours += hours;
                    }
                }
            }
            const salaryCoefficient = timesheet.employee.salaryCoefficient;
            if (!salaryCoefficient || salaryCoefficient <= 0) {
                this.logger.warn(`Cannot generate payroll for user ${timesheet.userID}: salaryCoefficient is missing or zero.`);
                return {
                    statusCode: 400,
                    message: `Employee ${timesheet.employee.username} does not have a valid salary coefficient. Please update employee profile.`,
                };
            }
            const totalSalaryByHours = (totalHours + totalExtraHours * 1.5) * salaryCoefficient;
            const payroll = await this.prisma.payroll.create({
                data: {
                    userID: timesheet.userID,
                    month: timesheet.month,
                    year: timesheet.year,
                    monthlyTimesheetID,
                    totalHours,
                    totalExtraHours,
                    totalSalaryByHours,
                },
            });
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: 'Payroll generated successfully',
                data: payroll,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error('Error generating payroll: ' + message);
            return { statusCode: 500, message: 'Internal server error' };
        }
    }
    async getMyPayroll(userID, month, year) {
        try {
            const periodError = this.validatePeriod(month, year);
            if (periodError)
                return periodError;
            const filter = { userID };
            if (month)
                filter.month = month;
            if (year)
                filter.year = year;
            const payrolls = await this.prisma.payroll.findMany({
                where: filter,
                include: {
                    monthlyTimesheet: true,
                },
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Get my payrolls successfully',
                data: payrolls,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error('Error fetching user payroll: ' + message);
            return { statusCode: 500, message: 'Internal server error' };
        }
    }
    async getDepartmentPayroll(departmentID, month, year) {
        try {
            const periodError = this.validatePeriod(month, year);
            if (periodError)
                return periodError;
            const departmentExists = await this.prisma.department.findUnique({
                where: { departmentID },
            });
            if (!departmentExists) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'Department not found' };
            }
            const filter = {
                employee: { departmentID },
            };
            if (month)
                filter.month = month;
            if (year)
                filter.year = year;
            const payrolls = await this.prisma.payroll.findMany({
                where: filter,
                include: {
                    employee: {
                        select: { username: true, email: true, userID: true },
                    },
                },
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Get department payrolls successfully',
                data: payrolls,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error('Error fetching department payroll: ' + message);
            return { statusCode: 500, message: 'Internal server error' };
        }
    }
    async exportPayroll(month, year, format = 'json') {
        try {
            const periodError = this.validatePeriod(month, year);
            if (periodError)
                return periodError;
            const filter = {};
            if (month)
                filter.month = month;
            if (year)
                filter.year = year;
            const payrolls = await this.prisma.payroll.findMany({
                where: filter,
                include: {
                    ...payrollExportInclude,
                },
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
            });
            const warnings = this.buildExportWarnings(payrolls);
            if (format.toLowerCase() === 'csv') {
                const exporter = new CsvPayrollExporter();
                const csvString = exporter.export(payrolls);
                return {
                    statusCode: code_1.OK_CODE,
                    message: payrolls.length
                        ? 'Exported payroll successfully (CSV)'
                        : 'No payroll data matched the selected period',
                    data: csvString,
                    isCsv: true,
                    warnings,
                };
            }
            return {
                statusCode: code_1.OK_CODE,
                message: payrolls.length
                    ? 'Exported payroll successfully (JSON)'
                    : 'No payroll data matched the selected period',
                data: payrolls,
                isCsv: false,
                meta: {
                    count: payrolls.length,
                    warnings,
                    externalIntegration: 'not_configured',
                },
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error('Error exporting payroll: ' + message);
            return {
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }
    async exportPayrollExcel(month, year) {
        const periodError = this.validatePeriod(month, year);
        if (periodError) {
            throw new Error(periodError.message);
        }
        const filter = {};
        if (month)
            filter.month = month;
        if (year)
            filter.year = year;
        const payrolls = await this.prisma.payroll.findMany({
            where: filter,
            include: {
                ...payrollExportInclude,
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        return excel_helper_1.ExcelHelper.createPayrollWorkbook(payrolls, 'Payroll');
    }
    validatePeriod(month, year) {
        if (month !== undefined &&
            (!Number.isInteger(month) || month < 1 || month > 12)) {
            return {
                statusCode: 400,
                message: 'Payroll month must be between 1 and 12',
            };
        }
        if (year !== undefined && (!Number.isInteger(year) || year < 2000)) {
            return { statusCode: 400, message: 'Payroll year must be 2000 or later' };
        }
        return null;
    }
    buildExportWarnings(payrolls) {
        const warnings = [];
        if (payrolls.length > LARGE_EXPORT_WARNING_THRESHOLD) {
            warnings.push(`Export contains ${payrolls.length} rows. Consider splitting by month or department, or moving export to a background job before production scale.`);
        }
        const missingSalaryCount = payrolls.filter((payroll) => {
            const salaryCoefficient = payroll.employee?.salaryCoefficient;
            return !salaryCoefficient || salaryCoefficient <= 0;
        }).length;
        if (missingSalaryCount > 0) {
            warnings.push(`${missingSalaryCount} payroll rows have missing or zero salaryCoefficient on the employee record.`);
        }
        return warnings;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = PayrollService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map