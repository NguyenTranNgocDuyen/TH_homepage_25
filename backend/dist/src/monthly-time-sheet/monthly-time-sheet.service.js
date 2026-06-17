"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyTimeSheetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const code_1 = require("../common/code");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user/user.service");
const department_service_1 = require("../department/department.service");
const notification_service_1 = require("../notification/notification.service");
const email_service_1 = require("../common/email.service");
const excel_helper_1 = require("../common/excel.helper");
const ExcelJS = __importStar(require("exceljs"));
let MonthlyTimeSheetService = class MonthlyTimeSheetService {
    prismaService;
    userService;
    departmentService;
    notificationService;
    emailService;
    constructor(prismaService, userService, departmentService, notificationService, emailService) {
        this.prismaService = prismaService;
        this.userService = userService;
        this.departmentService = departmentService;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }
    async refreshCanSubmit(monthlyTimesheetID, tx) {
        const db = tx ?? this.prismaService;
        const timesheet = await db.monthlyTimesheet.findUnique({
            where: { monthlyTimesheetID },
            include: {
                entries: true,
                corrections: {
                    where: { status: client_1.TimesheetStatus.PENDING },
                },
            },
        });
        if (!timesheet)
            return false;
        const hasEntries = timesheet.entries.length > 0;
        const hasPendingCorrection = timesheet.corrections.length > 0;
        const isLocked = timesheet.status === client_1.MonthlyTimesheetStatus.APPROVED ||
            timesheet.status === client_1.MonthlyTimesheetStatus.SUBMITTED;
        const canSubmit = hasEntries && !hasPendingCorrection && !isLocked;
        await db.monthlyTimesheet.update({
            where: { monthlyTimesheetID },
            data: { canSubmit },
        });
        return canSubmit;
    }
    async getMonthlyTimeSheet(userID, getMonthlyTimeSheetDto, tx) {
        const { month, year } = getMonthlyTimeSheetDto;
        const dCbt = tx ?? this.prismaService;
        const timesheet = await dCbt.monthlyTimesheet.findFirst({
            where: {
                userID,
                month,
                year,
            },
        });
        if (timesheet === null)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'Không có bảng công',
            };
        const canSubmit = await this.refreshCanSubmit(timesheet.monthlyTimesheetID, dCbt);
        return {
            statusCode: code_1.OK_CODE,
            message: 'get timesheet successfull',
            data: {
                monthlyTimesheetID: timesheet.monthlyTimesheetID,
                userID: timesheet.userID,
                month: timesheet.month,
                year: timesheet.year,
                status: timesheet.status,
                canSubmit,
                isSubmitted: timesheet.isSubmitted,
                reasonReject: timesheet.reasonReject,
                reviewedAt: timesheet.reviewedAt,
            },
        };
    }
    async getTimesheetReport(query, currentUser) {
        const filters = await this.normalizeReportFilters(query, currentUser);
        const entryWhere = {};
        if (filters.fromDate || filters.toDate) {
            entryWhere.date = {};
            if (filters.fromDate)
                entryWhere.date.gte = filters.fromDate;
            if (filters.toDate)
                entryWhere.date.lte = filters.toDate;
        }
        const where = {};
        const monthlyStatus = this.toMonthlyStatusFilter(filters.status);
        if (filters.employeeId) {
            where.userID = filters.employeeId;
        }
        if (filters.departmentId) {
            where.employee = { departmentID: filters.departmentId };
        }
        if (monthlyStatus) {
            where.status = monthlyStatus;
        }
        if (Object.keys(entryWhere).length > 0) {
            where.entries = { some: entryWhere };
        }
        const timesheets = await this.prismaService.monthlyTimesheet.findMany({
            where,
            include: {
                employee: {
                    select: {
                        userID: true,
                        username: true,
                        email: true,
                        departmentID: true,
                        department: {
                            select: {
                                departmentID: true,
                                departmentName: true,
                            },
                        },
                    },
                },
                entries: {
                    where: entryWhere,
                    orderBy: { date: 'asc' },
                },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        const rows = timesheets.flatMap((timesheet) => timesheet.entries.map((entry) => this.toReportRow({
            monthlyTimesheetID: timesheet.monthlyTimesheetID,
            month: timesheet.month,
            year: timesheet.year,
            status: timesheet.status,
            employee: timesheet.employee,
            entry,
        })));
        rows.sort((left, right) => right.workDate.localeCompare(left.workDate));
        return {
            filters,
            rows,
            summary: this.buildTimesheetReportSummary(rows),
        };
    }
    async getMonthlyTimesheetsForReview(month, year, currentManagerId) {
        if (!currentManagerId) {
            throw new common_1.BadRequestException('Manager userID is required');
        }
        if (!Number.isInteger(month) ||
            month < 1 ||
            month > 12 ||
            !Number.isInteger(year) ||
            year < 1900) {
            throw new common_1.BadRequestException('Invalid month or year');
        }
        const timesheets = await this.prismaService.monthlyTimesheet.findMany({
            where: {
                month,
                year,
                employee: {
                    department: {
                        managerID: currentManagerId,
                    },
                },
            },
            include: {
                employee: {
                    include: {
                        department: true,
                    },
                },
                entries: {
                    orderBy: { date: 'asc' },
                },
            },
            orderBy: [{ createdAt: 'desc' }, { monthlyTimesheetID: 'asc' }],
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'get monthly timesheets for review successfull',
            data: timesheets,
        };
    }
    async exportPersonalTimesheetCsv(userID, month, year, format = 'csv') {
        if (format.toLowerCase() !== 'csv')
            throw new common_1.BadRequestException('Only csv format is supported');
        const timesheet = await this.prismaService.monthlyTimesheet.findFirst({
            where: { userID, month, year },
            include: { entries: true },
        });
        if (!timesheet)
            throw new common_1.NotFoundException('This timesheet isnt exist');
        return this.buildCsvFromEntries(timesheet.entries);
    }
    buildCsvFromEntries(entries) {
        const header = ['Ngày', 'Check-in', 'Check-out', 'Tổng giờ', 'Trạng thái'];
        const rows = entries
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((entry) => {
            const checkIn = this.formatDateTime(entry.checkIn);
            const checkOut = entry.checkOut
                ? this.formatDateTime(entry.checkOut)
                : '';
            const totalHours = entry.checkOut
                ? ((new Date(entry.checkOut).getTime() -
                    new Date(entry.checkIn).getTime()) /
                    3600000).toFixed(2)
                : '';
            return [entry.date, checkIn, checkOut, totalHours, entry.status]
                .map((value) => this.csvEscape(value))
                .join(',');
        });
        return [
            header.map((value) => this.csvEscape(value)).join(','),
            ...rows,
        ].join('\r\n');
    }
    formatDateTime(value) {
        const date = new Date(value);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    csvEscape(value) {
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
    }
    async normalizeReportFilters(query, currentUser) {
        const requestedDepartmentId = this.cleanFilterValue(query.departmentId || query.departmentID);
        const employeeId = this.cleanFilterValue(query.employeeId || query.userID);
        const roleName = String(currentUser?.roleName || currentUser?.role || '').toLowerCase();
        const isAdmin = roleName === 'admin' || roleName === 'hr';
        let departmentId = requestedDepartmentId;
        if (!isAdmin) {
            const managerDepartmentId = currentUser?.departmentID ||
                (currentUser?.userID
                    ? await this.getUserDepartmentID(currentUser.userID)
                    : '');
            if (!managerDepartmentId) {
                throw new common_1.BadRequestException('Manager department is required');
            }
            if (requestedDepartmentId &&
                requestedDepartmentId !== managerDepartmentId) {
                throw new common_1.ForbiddenException('Managers can only view their own department report');
            }
            departmentId = managerDepartmentId;
        }
        return {
            fromDate: this.cleanFilterValue(query.fromDate),
            toDate: this.cleanFilterValue(query.toDate),
            employeeId,
            departmentId,
            status: this.normalizeReportStatusFilter(query.status),
        };
    }
    cleanFilterValue(value) {
        const normalized = String(value || '').trim();
        if (!normalized || normalized.toLowerCase() === 'all')
            return undefined;
        return normalized;
    }
    normalizeReportStatusFilter(status) {
        const normalized = String(status || '')
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, '');
        switch (normalized) {
            case '':
            case 'all':
                return undefined;
            case 'draft':
            case 'pending':
                return 'Pending';
            case 'submitted':
                return 'Submitted';
            case 'approved':
            case 'accepted':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return status?.trim();
        }
    }
    toMonthlyStatusFilter(status) {
        switch (String(status || '')
            .trim()
            .toLowerCase()) {
            case 'pending':
            case 'draft':
                return client_1.MonthlyTimesheetStatus.DRAFT;
            case 'submitted':
                return client_1.MonthlyTimesheetStatus.SUBMITTED;
            case 'approved':
            case 'accepted':
                return client_1.MonthlyTimesheetStatus.APPROVED;
            case 'rejected':
                return client_1.MonthlyTimesheetStatus.REJECTED;
            default:
                return undefined;
        }
    }
    async getUserDepartmentID(userID) {
        const user = await this.prismaService.user.findUnique({
            where: { userID },
            select: { departmentID: true },
        });
        return user?.departmentID || '';
    }
    toReportRow(input) {
        const status = this.toReportDisplayStatus(input.status);
        const employeeId = input.employee.userID;
        const monthText = String(input.month).padStart(2, '0');
        const shortEmployeeId = employeeId.slice(0, 8).toUpperCase();
        return {
            id: input.entry.timesheetEntryID,
            code: `TS-${input.year}${monthText}-${shortEmployeeId}`,
            monthlyTimesheetID: input.monthlyTimesheetID,
            timesheetEntryID: input.entry.timesheetEntryID,
            employeeId,
            employeeName: input.employee.username || input.employee.email,
            employeeEmail: input.employee.email,
            departmentId: input.employee.department?.departmentID ||
                input.employee.departmentID ||
                '',
            departmentName: input.employee.department?.departmentName || '',
            workDate: input.entry.date,
            date: input.entry.date,
            checkIn: this.formatTime(input.entry.checkIn),
            checkOut: this.formatTime(input.entry.checkOut),
            totalHours: this.calculateEntryHours(input.entry.checkIn, input.entry.checkOut),
            status,
            monthlyStatus: input.status,
            entryStatus: input.entry.status,
            locked: input.status === client_1.MonthlyTimesheetStatus.APPROVED,
            warnings: this.buildReportWarnings(input.entry),
        };
    }
    toReportDisplayStatus(status) {
        switch (status) {
            case client_1.MonthlyTimesheetStatus.SUBMITTED:
                return 'Submitted';
            case client_1.MonthlyTimesheetStatus.APPROVED:
                return 'Approved';
            case client_1.MonthlyTimesheetStatus.REJECTED:
                return 'Rejected';
            case client_1.MonthlyTimesheetStatus.DRAFT:
            default:
                return 'Pending';
        }
    }
    buildReportWarnings(entry) {
        const warnings = [];
        if (!entry.checkOut || entry.status === client_1.TimesheetStatus.MISSING_OUT) {
            warnings.push('Missing Out');
        }
        if (entry.isWarning) {
            warnings.push('Warning');
        }
        if (entry.status === client_1.TimesheetStatus.REJECTED) {
            warnings.push('Rejected Entry');
        }
        return warnings;
    }
    formatTime(value) {
        if (!value)
            return '';
        const date = new Date(value);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    calculateEntryHours(checkIn, checkOut) {
        if (!checkIn || !checkOut)
            return 0;
        const hours = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 3600000;
        return Math.round(Math.max(hours, 0) * 100) / 100;
    }
    buildTimesheetReportSummary(rows) {
        const byStatus = rows.reduce((acc, row) => {
            acc[row.status] = (acc[row.status] || 0) + 1;
            return acc;
        }, {});
        const totalHours = rows.reduce((total, row) => total + Number(row.totalHours || 0), 0);
        return {
            totalRecords: rows.length,
            totalEmployees: new Set(rows.map((row) => row.employeeId)).size,
            totalHours: Math.round(totalHours * 100) / 100,
            pending: byStatus.Pending || 0,
            submitted: byStatus.Submitted || 0,
            approved: byStatus.Approved || 0,
            rejected: byStatus.Rejected || 0,
            missingOut: rows.filter((row) => row.warnings.includes('Missing Out'))
                .length,
            warningRecords: rows.filter((row) => row.warnings.length > 0).length,
            byStatus,
        };
    }
    async createMonthlyTimeSheet(userID, createMonthlyTimeSheetDto, tx) {
        const { month, year } = createMonthlyTimeSheetDto;
        try {
            const executeLogic = async (dCbt) => {
                const { statusCode, message } = await this.getMonthlyTimeSheet(userID, {
                    month: createMonthlyTimeSheetDto.month,
                    year: createMonthlyTimeSheetDto.year,
                }, dCbt);
                if (statusCode === code_1.OK_CODE)
                    throw new common_1.ConflictException(message);
                const user = await this.userService.getUserByUserID(userID, dCbt);
                if (user.statusCode !== code_1.OK_CODE ||
                    user.data === undefined ||
                    user.data.departmentID === null ||
                    user.data.departmentID === undefined)
                    throw new common_1.BadRequestException(user.message);
                const department = await this.departmentService.getDepartmentById(user.data.departmentID, dCbt);
                if (department.statusCode !== code_1.OK_CODE || department.data === undefined)
                    throw new common_1.BadRequestException(department.message);
                const reviewerID = department.data.managerID;
                if (reviewerID === undefined || reviewerID === null)
                    throw new common_1.BadRequestException('Please update managerID for this department before create monthly timesheet for this user !!!! ');
                if (statusCode === code_1.NOTFOUND_CODE) {
                    const timesheet = await dCbt.monthlyTimesheet.create({
                        data: {
                            userID,
                            month,
                            year,
                            status: client_1.MonthlyTimesheetStatus.DRAFT,
                        },
                    });
                    return {
                        statusCode: code_1.CREATED_RESPONE,
                        message: 'Created successfull',
                        data: {
                            monthlyTimesheetID: timesheet.monthlyTimesheetID,
                            userID: timesheet.userID,
                            month: timesheet.month,
                            year: timesheet.year,
                            status: timesheet.status,
                            canSubmit: timesheet.canSubmit,
                            isSubmitted: timesheet.isSubmitted,
                        },
                    };
                }
                throw new common_1.BadRequestException('Another Error!!!!');
            };
            if (tx)
                return await executeLogic(tx);
            return await this.prismaService.$transaction(async (tx) => executeLogic(tx), { timeout: 30000 });
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'getStatus' in error &&
                typeof error.getStatus === 'function') {
                throw error;
            }
            console.error('Error in createMonthlyTimeSheet:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred',
            };
        }
    }
    async SubmitMonthlyTimesheet(monthlyTimesheetID, tx) {
        try {
            const executeLogic = async (dCbt) => {
                const monthGet = await dCbt.monthlyTimesheet.findUnique({
                    where: {
                        monthlyTimesheetID,
                    },
                    include: {
                        entries: true,
                        corrections: {
                            where: { status: client_1.TimesheetStatus.PENDING },
                        },
                    },
                });
                if (!monthGet) {
                    throw new common_1.NotFoundException('monthly timesheet is not found');
                }
                if (monthGet.isSubmitted === true)
                    throw new common_1.BadRequestException('You were submit this timesheet');
                if (monthGet.status === client_1.MonthlyTimesheetStatus.APPROVED)
                    throw new common_1.BadRequestException('Approved monthly timesheet is locked');
                const currentDate = new Date();
                const currentDay = currentDate.getDate();
                const currentMonth = currentDate.getMonth() + 1;
                const currentYear = currentDate.getFullYear();
                if (currentDay < 1 || currentDay > 5) {
                    throw new common_1.BadRequestException('Bạn chỉ có thể nộp bảng công từ ngày 1 đến ngày 5 hàng tháng.');
                }
                let expectedMonth = currentMonth - 1;
                let expectedYear = currentYear;
                if (expectedMonth === 0) {
                    expectedMonth = 12;
                    expectedYear = currentYear - 1;
                }
                if (monthGet.month !== expectedMonth ||
                    monthGet.year !== expectedYear) {
                    throw new common_1.BadRequestException(`Bạn chỉ được phép nộp bảng công của tháng trước (${expectedMonth}/${expectedYear}).`);
                }
                const canSubmit = await this.refreshCanSubmit(monthGet.monthlyTimesheetID, dCbt);
                if (canSubmit === false)
                    throw new common_1.BadRequestException('This monthly timesheet cannot be  submitted ');
                await dCbt.monthlyTimesheet.update({
                    where: {
                        monthlyTimesheetID: monthGet.monthlyTimesheetID,
                    },
                    data: {
                        isSubmitted: true,
                        canSubmit: false,
                        status: client_1.MonthlyTimesheetStatus.SUBMITTED,
                    },
                });
                const userGet = await this.userService.getUserByUserID(monthGet.userID, dCbt);
                if (userGet?.statusCode !== code_1.OK_CODE ||
                    userGet.data === undefined ||
                    userGet.data?.departmentID === null ||
                    userGet.data?.departmentID === undefined)
                    throw new common_1.NotFoundException('please at departmentID to this employee');
                const department = await this.departmentService.getDepartmentById(userGet.data?.departmentID, dCbt);
                if (department?.statusCode != code_1.OK_CODE ||
                    department.data === undefined ||
                    department.data?.managerID === undefined ||
                    department.data?.managerID === null)
                    throw new common_1.NotFoundException('Please add managerID to this department ');
                const notificationGet = await this.notificationService.createNotification(userGet.data.userID, department.data.managerID, `Monthly timesheet ${monthGet.month}/${monthGet.year} from ${userGet.data.username} needs review.`, client_1.NotificationRelatedType.TIMESHEET, dCbt);
                if (notificationGet.statusCode !== code_1.CREATED_RESPONE)
                    throw new common_1.BadRequestException(notificationGet.message);
                try {
                    const manager = await dCbt.user.findUnique({
                        where: { userID: department.data.managerID },
                        select: { email: true },
                    });
                    if (manager?.email) {
                        await this.emailService.sendTimesheetNotification({
                            recipientEmail: manager.email,
                            employeeName: userGet.data.username,
                            month: monthGet.month,
                            year: monthGet.year,
                            status: 'submitted',
                        });
                    }
                }
                catch (e) {
                    console.error('Email error in SubmitMonthlyTimesheet:', e);
                }
                return {
                    statusCode: code_1.OK_CODE,
                    message: 'submit monthly timesheet successfull',
                    data: {
                        monthlyTimesheetID: monthGet.monthlyTimesheetID,
                        userID: monthGet.userID,
                        month: monthGet.month,
                        year: monthGet.year,
                        status: client_1.MonthlyTimesheetStatus.SUBMITTED,
                        canSubmit: false,
                        isSubmitted: true,
                    },
                };
            };
            if (tx)
                return await executeLogic(tx);
            return await this.prismaService.$transaction(async (tx) => executeLogic(tx), { timeout: 30000 });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Error submitting timesheet:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred',
            };
        }
    }
    async reviewMonthlyTimesheet(monthlyTimesheetID, reviewMonthlyTimesheetDto, reviewerID, tx) {
        const { accept, reasonReject } = reviewMonthlyTimesheetDto;
        try {
            const executeLogic = async (dCbt) => {
                if (!accept && !reasonReject?.trim())
                    throw new common_1.BadRequestException('Reason for rejection is required');
                const monthGet = await dCbt.monthlyTimesheet.findUnique({
                    where: {
                        monthlyTimesheetID,
                    },
                });
                if (monthGet === undefined ||
                    monthGet?.userID === undefined ||
                    monthGet.userID === null)
                    throw new common_1.NotFoundException('Not found ');
                if (monthGet?.isSubmitted === false)
                    throw new common_1.BadRequestException('This monthly was not submitted ');
                if (monthGet.status === client_1.MonthlyTimesheetStatus.APPROVED)
                    throw new common_1.BadRequestException('This monthly timesheet was already approved');
                const now = new Date();
                const monthlyTimesheetUpdate = await dCbt.monthlyTimesheet.update({
                    where: {
                        monthlyTimesheetID: monthGet?.monthlyTimesheetID,
                    },
                    data: {
                        status: accept
                            ? client_1.MonthlyTimesheetStatus.APPROVED
                            : client_1.MonthlyTimesheetStatus.REJECTED,
                        reasonReject: accept ? null : reasonReject?.trim(),
                        canSubmit: false,
                        isSubmitted: accept ? true : false,
                        approvedById: accept ? (reviewerID ?? null) : null,
                        reviewedAt: now,
                    },
                });
                if (accept) {
                    await dCbt.timesheetEntry.updateMany({
                        where: {
                            monthlyTimesheetID: monthGet.monthlyTimesheetID,
                            checkOut: { not: null },
                        },
                        data: {
                            status: client_1.TimesheetStatus.APPROVED,
                            canRequestCorrection: false,
                        },
                    });
                }
                else {
                    await dCbt.timesheetEntry.updateMany({
                        where: { monthlyTimesheetID: monthGet.monthlyTimesheetID },
                        data: {
                            status: client_1.TimesheetStatus.PENDING,
                            canRequestCorrection: true,
                        },
                    });
                }
                const userGet = await this.userService.getUserByUserID(monthGet?.userID, dCbt);
                if (userGet?.statusCode !== code_1.OK_CODE ||
                    userGet.data === undefined ||
                    userGet.data?.departmentID === null ||
                    userGet.data?.departmentID === undefined)
                    throw new common_1.NotFoundException('please at departmentID to this employee');
                const department = await this.departmentService.getDepartmentById(userGet.data?.departmentID, dCbt);
                if (department?.statusCode != code_1.OK_CODE ||
                    department.data === undefined ||
                    department.data?.managerID === undefined ||
                    department.data?.managerID === null)
                    throw new common_1.NotFoundException('Please add managerID to this department ');
                const canSubmit = accept
                    ? false
                    : await this.refreshCanSubmit(monthGet.monthlyTimesheetID, dCbt);
                const reviewStatus = accept ? 'approved' : 'rejected';
                const rejectReason = !accept && monthlyTimesheetUpdate.reasonReject
                    ? ` Reason: ${monthlyTimesheetUpdate.reasonReject}`
                    : '';
                const notificationGet = await this.notificationService.createNotification(reviewerID ?? department.data.managerID, userGet.data.userID, `Your monthly timesheet ${monthlyTimesheetUpdate.month}/${monthlyTimesheetUpdate.year} was ${reviewStatus}.${rejectReason}`, client_1.NotificationRelatedType.TIMESHEET, dCbt);
                if (notificationGet.statusCode !== code_1.CREATED_RESPONE)
                    throw new common_1.BadRequestException(notificationGet.message);
                try {
                    await this.emailService.sendTimesheetNotification({
                        recipientEmail: userGet.data.email,
                        employeeName: userGet.data.username,
                        month: monthlyTimesheetUpdate.month,
                        year: monthlyTimesheetUpdate.year,
                        status: accept ? 'approved' : 'rejected',
                        reason: monthlyTimesheetUpdate.reasonReject ?? undefined,
                    });
                }
                catch (e) {
                    console.error('Email error in reviewMonthlyTimesheet:', e);
                }
                return {
                    statusCode: code_1.OK_CODE,
                    message: 'review monthly timesheet successfull',
                    data: {
                        monthlyTimesheetID: monthlyTimesheetUpdate.monthlyTimesheetID,
                        userID: monthlyTimesheetUpdate.userID,
                        month: monthlyTimesheetUpdate.month,
                        year: monthlyTimesheetUpdate.year,
                        status: monthlyTimesheetUpdate.status,
                        reasonReject: monthlyTimesheetUpdate.reasonReject,
                        canSubmit,
                        isSubmitted: monthlyTimesheetUpdate.isSubmitted,
                        reviewedAt: monthlyTimesheetUpdate.reviewedAt,
                    },
                };
            };
            if (tx)
                return await executeLogic(tx);
            return await this.prismaService.$transaction(async (tx) => executeLogic(tx), { timeout: 30000 });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('Error submitting timesheet:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred',
            };
        }
    }
    async exportTimesheetCsv(userID, month, year) {
        const timesheet = await this.prismaService.monthlyTimesheet.findUnique({
            where: {
                userID_month_year: { userID, month, year },
            },
            include: {
                entries: {
                    orderBy: { date: 'asc' },
                },
            },
        });
        if (!timesheet) {
            throw new common_1.NotFoundException('Timesheet not found');
        }
        let csv = 'Ngày,Check-in,Check-out,Tổng giờ,Trạng thái\n';
        for (const entry of timesheet.entries) {
            const checkIn = entry.checkIn
                ? new Date(entry.checkIn).toLocaleString('vi-VN')
                : '';
            const checkOut = entry.checkOut
                ? new Date(entry.checkOut).toLocaleString('vi-VN')
                : '';
            let totalHours = 0;
            if (entry.checkIn && entry.checkOut) {
                totalHours =
                    (new Date(entry.checkOut).getTime() -
                        new Date(entry.checkIn).getTime()) /
                        (1000 * 60 * 60);
            }
            csv += `"${entry.date}","${checkIn}","${checkOut}","${totalHours.toFixed(2)}","${entry.status}"\n`;
        }
        return csv;
    }
    async exportDepartmentTimesheetCsv(departmentID, month, year) {
        const users = await this.prismaService.user.findMany({
            where: { departmentID },
            select: { userID: true, username: true },
        });
        if (!users || users.length === 0) {
            throw new common_1.NotFoundException('No users found in this department');
        }
        const userIds = users.map((u) => u.userID);
        const timesheets = await this.prismaService.monthlyTimesheet.findMany({
            where: {
                userID: { in: userIds },
                month,
                year,
            },
            include: {
                entries: {
                    orderBy: { date: 'asc' },
                },
                employee: { select: { username: true } },
            },
        });
        let csv = 'Nhân viên,Ngày,Check-in,Check-out,Tổng giờ,Trạng thái\n';
        for (const ts of timesheets) {
            for (const entry of ts.entries) {
                const checkIn = entry.checkIn
                    ? new Date(entry.checkIn).toLocaleString('vi-VN')
                    : '';
                const checkOut = entry.checkOut
                    ? new Date(entry.checkOut).toLocaleString('vi-VN')
                    : '';
                let totalHours = 0;
                if (entry.checkIn && entry.checkOut) {
                    totalHours =
                        (new Date(entry.checkOut).getTime() -
                            new Date(entry.checkIn).getTime()) /
                            (1000 * 60 * 60);
                }
                csv += `"${ts.employee.username}","${entry.date}","${checkIn}","${checkOut}","${totalHours.toFixed(2)}","${entry.status}"\n`;
            }
        }
        return csv;
    }
    async exportPersonalTimesheetExcel(userID, month, year) {
        const timesheet = await this.prismaService.monthlyTimesheet.findFirst({
            where: { userID, month, year },
            include: { entries: true },
        });
        if (!timesheet) {
            throw new common_1.NotFoundException('Timesheet not found');
        }
        return excel_helper_1.ExcelHelper.createTimesheetWorkbook(timesheet.entries, `Timesheet_${userID}_${month}_${year}`);
    }
    async exportDepartmentTimesheetExcel(departmentID, month, year) {
        const timesheets = await this.prismaService.monthlyTimesheet.findMany({
            where: {
                employee: { departmentID },
                month,
                year,
            },
            include: {
                entries: true,
                employee: true,
            },
        });
        const workbook = new ExcelJS.Workbook();
        for (const ts of timesheets) {
            const sheet = workbook.addWorksheet(ts.employee.username);
            sheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Check In', key: 'checkIn', width: 20 },
                { header: 'Check Out', key: 'checkOut', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Device Info', key: 'deviceInfo', width: 30 },
            ];
            ts.entries.forEach((e) => {
                sheet.addRow({
                    date: e.date,
                    checkIn: e.checkIn ? new Date(e.checkIn).toLocaleString() : '',
                    checkOut: e.checkOut ? new Date(e.checkOut).toLocaleString() : '',
                    status: e.status,
                    deviceInfo: e.deviceInfo || '',
                });
            });
        }
        return workbook;
    }
};
exports.MonthlyTimeSheetService = MonthlyTimeSheetService;
exports.MonthlyTimeSheetService = MonthlyTimeSheetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService,
        department_service_1.DepartmentService,
        notification_service_1.NotificationService,
        email_service_1.EmailService])
], MonthlyTimeSheetService);
//# sourceMappingURL=monthly-time-sheet.service.js.map