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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModuleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
const code_1 = require("../common/code");
const client_1 = require("@prisma/client");
const monthly_time_sheet_service_1 = require("../monthly-time-sheet/monthly-time-sheet.service");
const notification_service_1 = require("../notification/notification.service");
let AttendanceModuleService = class AttendanceModuleService {
    prismaService;
    userService;
    monthlyTimesheetService;
    notificationService;
    constructor(prismaService, userService, monthlyTimesheetService, notificationService) {
        this.prismaService = prismaService;
        this.userService = userService;
        this.monthlyTimesheetService = monthlyTimesheetService;
        this.notificationService = notificationService;
    }
    async reopenCurrentTimesheetForAttendance(monthlyTimesheetID, status, dbCtx) {
        if (status !== client_1.MonthlyTimesheetStatus.APPROVED &&
            status !== client_1.MonthlyTimesheetStatus.SUBMITTED) {
            return;
        }
        await dbCtx.monthlyTimesheet.update({
            where: { monthlyTimesheetID },
            data: {
                status: client_1.MonthlyTimesheetStatus.DRAFT,
                isSubmitted: false,
                canSubmit: false,
                reasonReject: null,
                approvedById: null,
                reviewedAt: null,
            },
        });
    }
    async getAllAttedencOfMonth(userID, getAttedencOfMonth, tx) {
        const { month, year } = getAttedencOfMonth;
        const db = tx ?? this.prismaService;
        const { statusCode, data } = await this.monthlyTimesheetService.getMonthlyTimeSheet(userID, getAttedencOfMonth, db);
        if (statusCode !== code_1.OK_CODE || data === undefined)
            return {
                statusCode,
                message: 'Dont have any attendence',
            };
        const allAttedencOfMonth = await db.timesheetEntry.findMany({
            where: {
                monthlyTimesheetID: data.monthlyTimesheetID,
            },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get all attendence of month successfull !!!!',
            data: allAttedencOfMonth,
        };
    }
    async checkIn(userID, IPAddress, deviceInfo, tx) {
        if (!IPAddress) {
            return { statusCode: code_1.BADREQUEST_CODE, message: 'IP address is missing' };
        }
        try {
            const executeLogic = async (dbCtx) => {
                const now = new Date();
                if (now.getHours() < 6) {
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: 'You can only check in after 6:00 AM.',
                    };
                }
                const month = now.getMonth() + 1;
                const year = now.getFullYear();
                const currentDateString = `${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const [user, timesheet] = await Promise.all([
                    dbCtx.user.findUnique({
                        where: { userID },
                        select: {
                            departmentID: true,
                            department: { select: { managerID: true } },
                        },
                    }),
                    dbCtx.monthlyTimesheet.findFirst({
                        where: { userID, month, year },
                        select: { monthlyTimesheetID: true, status: true },
                    }),
                ]);
                if (!user)
                    return { statusCode: code_1.NOTFOUND_CODE, message: 'User not found' };
                if (!user.departmentID)
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: 'Please add departmentID to this employee',
                    };
                if (!user.department?.managerID)
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: 'Please update managerID for this department before create monthly timesheet for this user !!!! ',
                    };
                let timesheetID;
                let needsTimesheetUpdate = false;
                let timesheetUpdateData = {
                    canSubmit: false,
                };
                if (!timesheet) {
                    const newTimesheet = await dbCtx.monthlyTimesheet.create({
                        data: {
                            userID,
                            month,
                            year,
                            status: client_1.MonthlyTimesheetStatus.DRAFT,
                            canSubmit: false,
                        },
                        select: { monthlyTimesheetID: true },
                    });
                    timesheetID = newTimesheet.monthlyTimesheetID;
                }
                else {
                    timesheetID = timesheet.monthlyTimesheetID;
                    needsTimesheetUpdate = true;
                    if (timesheet.status === client_1.MonthlyTimesheetStatus.APPROVED ||
                        timesheet.status === client_1.MonthlyTimesheetStatus.SUBMITTED) {
                        timesheetUpdateData = {
                            ...timesheetUpdateData,
                            status: client_1.MonthlyTimesheetStatus.DRAFT,
                            isSubmitted: false,
                            reasonReject: null,
                            approvedById: null,
                            reviewedAt: null,
                        };
                    }
                }
                const lastEntry = await dbCtx.timesheetEntry.findFirst({
                    where: {
                        date: currentDateString,
                        monthlyTimesheetID: timesheetID,
                    },
                    orderBy: { checkIn: 'desc' },
                    select: { checkOut: true },
                });
                if (lastEntry && lastEntry.checkOut === null) {
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: 'You have already checked in. Please check out first before checking in again.',
                    };
                }
                const createEntryPromise = dbCtx.timesheetEntry.create({
                    data: {
                        monthlyTimesheetID: timesheetID,
                        date: currentDateString,
                        IPAddress,
                        deviceInfo,
                        checkIn: now,
                        status: client_1.TimesheetStatus.PENDING,
                    },
                });
                let createdEntry;
                if (needsTimesheetUpdate) {
                    const updateTimesheetPromise = dbCtx.monthlyTimesheet.update({
                        where: { monthlyTimesheetID: timesheetID },
                        data: timesheetUpdateData,
                    });
                    const [entry] = await Promise.all([
                        createEntryPromise,
                        updateTimesheetPromise,
                    ]);
                    createdEntry = entry;
                }
                else {
                    createdEntry = await createEntryPromise;
                }
                return {
                    statusCode: code_1.CREATED_RESPONE,
                    message: 'Check-in successful!',
                    data: createdEntry,
                };
            };
            if (tx)
                return await executeLogic(tx);
            return await executeLogic(this.prismaService);
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'getStatus' in error &&
                typeof error.getStatus === 'function') {
                throw error;
            }
            console.error('Error in checkIn:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred during check-in',
            };
        }
    }
    async checkOut(userID, IPAddress, deviceInfo, tx) {
        if (!IPAddress) {
            return { statusCode: code_1.BADREQUEST_CODE, message: 'IP address is missing' };
        }
        try {
            let isWarning = false;
            let managerIdToNotify = null;
            let userName = '';
            const executeLogic = async (dbCtx) => {
                const now = new Date();
                const month = now.getMonth() + 1;
                const year = now.getFullYear();
                const currentDateString = `${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const [user, timesheet] = await Promise.all([
                    dbCtx.user.findUnique({
                        where: { userID },
                        select: {
                            username: true,
                            department: { select: { managerID: true } },
                        },
                    }),
                    dbCtx.monthlyTimesheet.findFirst({
                        where: { userID, month, year },
                        select: { monthlyTimesheetID: true, status: true },
                    }),
                ]);
                if (!user)
                    return { statusCode: code_1.NOTFOUND_CODE, message: 'User not found' };
                userName = user.username || 'Employee';
                managerIdToNotify = user.department?.managerID || null;
                if (!timesheet) {
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: "You haven't checked in yet.",
                    };
                }
                const timesheetID = timesheet.monthlyTimesheetID;
                const lastEntry = await dbCtx.timesheetEntry.findFirst({
                    where: {
                        monthlyTimesheetID: timesheetID,
                        date: currentDateString,
                    },
                    orderBy: { checkIn: 'desc' },
                    select: {
                        timesheetEntryID: true,
                        checkOut: true,
                        IPAddress: true,
                        deviceInfo: true,
                    },
                });
                if (!lastEntry || lastEntry.checkOut !== null) {
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: "You haven't checked in or have already checked out.",
                    };
                }
                if (lastEntry.IPAddress !== IPAddress) {
                    isWarning = true;
                }
                let needsTimesheetUpdate = false;
                let timesheetUpdateData = {};
                if (timesheet.status === client_1.MonthlyTimesheetStatus.APPROVED ||
                    timesheet.status === client_1.MonthlyTimesheetStatus.SUBMITTED) {
                    needsTimesheetUpdate = true;
                    timesheetUpdateData = {
                        status: client_1.MonthlyTimesheetStatus.DRAFT,
                        isSubmitted: false,
                        canSubmit: false,
                        reasonReject: null,
                        approvedById: null,
                        reviewedAt: null,
                    };
                }
                const updateEntryPromise = dbCtx.timesheetEntry.update({
                    where: { timesheetEntryID: lastEntry.timesheetEntryID },
                    data: {
                        checkOut: now,
                        deviceInfo: deviceInfo ?? lastEntry.deviceInfo,
                        isWarning: isWarning,
                    },
                });
                let updatedEntry;
                if (needsTimesheetUpdate) {
                    const updateTimesheetPromise = dbCtx.monthlyTimesheet.update({
                        where: { monthlyTimesheetID: timesheetID },
                        data: timesheetUpdateData,
                    });
                    const [entry] = await Promise.all([
                        updateEntryPromise,
                        updateTimesheetPromise,
                    ]);
                    updatedEntry = entry;
                }
                else {
                    updatedEntry = await updateEntryPromise;
                }
                this.monthlyTimesheetService
                    .refreshCanSubmit(timesheetID, this.prismaService)
                    .catch(console.error);
                return {
                    statusCode: code_1.OK_CODE,
                    message: isWarning
                        ? 'Check-out successful with IP warning (Manager notified).'
                        : 'Check-out successful!',
                    data: updatedEntry,
                };
            };
            let result;
            if (tx) {
                result = await executeLogic(tx);
            }
            else {
                result = await executeLogic(this.prismaService);
            }
            if (result.statusCode === code_1.OK_CODE && isWarning && managerIdToNotify) {
                const warningMessage = `Cảnh báo: Nhân viên ${userName} check-out với IP khác (${IPAddress}) so với lúc check-in.`;
                this.notificationService
                    .createNotification('system', managerIdToNotify, warningMessage, client_1.NotificationRelatedType.WARNING)
                    .catch((err) => console.error('Error pushing IP warning notification:', err));
            }
            return result;
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'getStatus' in error &&
                typeof error.getStatus === 'function') {
                throw error;
            }
            console.error('Error in checkOut:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred during check-out',
            };
        }
    }
    async GetAllEmployeeDidNotCheckOutBefore(date, tx) {
        const db = tx ?? this.prismaService;
        const allEmployeeDidntCheckOut = await db.timesheetEntry.findMany({
            where: {
                date: {
                    lt: date,
                },
                checkOut: null,
                status: {
                    not: client_1.TimesheetStatus.MISSING_OUT,
                },
            },
            include: {
                monthlyTimesheet: {
                    include: {
                        employee: true,
                    },
                },
            },
        });
        if (allEmployeeDidntCheckOut.length === 0)
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'No employees missed check-out before ' + date,
            };
        return {
            statusCode: code_1.OK_CODE,
            message: 'Found employees who missed check-out before ' + date,
            data: allEmployeeDidntCheckOut,
        };
    }
};
exports.AttendanceModuleService = AttendanceModuleService;
exports.AttendanceModuleService = AttendanceModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService,
        monthly_time_sheet_service_1.MonthlyTimeSheetService,
        notification_service_1.NotificationService])
], AttendanceModuleService);
//# sourceMappingURL=attendance-module.service.js.map