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
exports.LeaveApplicationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const code_1 = require("../common/code");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
const email_service_1 = require("../common/email.service");
let LeaveApplicationService = class LeaveApplicationService {
    prisma;
    notificationService;
    emailService;
    constructor(prisma, notificationService, emailService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }
    async createLeaveApplication(userID, createDto) {
        try {
            const { typeLeaveID, startDate, endDate, reason } = createDto;
            const start = this.parseDateOnly(startDate);
            const end = this.parseDateOnly(endDate);
            const today = this.startOfToday();
            if (start > end) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Start date must be before or equal to end date',
                };
            }
            if (start < today) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Cannot create leave application for past dates',
                };
            }
            const currentYear = new Date().getFullYear();
            if (start.getFullYear() > currentYear ||
                end.getFullYear() > currentYear) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Cannot create leave application for the next year',
                };
            }
            const duration = this.calculateBusinessDays(start, end);
            if (duration <= 0) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Leave duration must include at least one weekday',
                };
            }
            const user = await this.prisma.user.findUnique({ where: { userID } });
            if (!user) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'User not found' };
            }
            const typeLeave = await this.prisma.typeLeave.findUnique({
                where: { typeLeaveID },
            });
            if (!typeLeave) {
                return { statusCode: code_1.NOTFOUND_CODE, message: 'Type leave not found' };
            }
            if (typeLeave.isActive === false) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Không thể tạo đơn xin nghỉ phép với loại nghỉ phép đã bị vô hiệu hóa',
                };
            }
            const overlappingApplication = await this.prisma.leaveApplication.findFirst({
                where: {
                    senderID: userID,
                    status: { in: [client_1.LeaveStatus.PENDING, client_1.LeaveStatus.APPROVED] },
                    startDate: { lte: end },
                    endDate: { gte: start },
                },
                select: {
                    leaveApplicationID: true,
                    startDate: true,
                    endDate: true,
                    status: true,
                },
            });
            if (overlappingApplication) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: `Leave application overlaps an existing ${overlappingApplication.status.toLowerCase()} request from ${this.formatDateVi(overlappingApplication.startDate)} to ${this.formatDateVi(overlappingApplication.endDate)}`,
                };
            }
            const isPaidLeave = Number(typeLeave.hasSalary) > 0;
            if (isPaidLeave && user.remainDaysofLeave < duration) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: `Not enough remaining annual leave. You have ${user.remainDaysofLeave} days left. Please choose an unpaid leave type.`,
                };
            }
            const conflictDates = await this.findWorkLogConflictDates(userID, start, end);
            const application = await this.prisma.leaveApplication.create({
                data: {
                    senderID: userID,
                    typeLeaveID,
                    startDate: start,
                    endDate: end,
                    duration,
                    reason,
                    status: client_1.LeaveStatus.PENDING,
                },
            });
            if (user.departmentID) {
                const department = await this.prisma.department.findUnique({
                    where: { departmentID: user.departmentID },
                });
                if (department?.managerID) {
                    const notification = await this.notificationService.createNotification(userID, department.managerID, `${user.username} đã gửi đơn nghỉ phép từ ${this.formatDateVi(start)} đến ${this.formatDateVi(end)} (${duration} ngày).`, client_1.NotificationRelatedType.LEAVE);
                    if (notification.statusCode !== code_1.CREATED_RESPONE) {
                        return {
                            statusCode: notification.statusCode,
                            message: notification.message,
                        };
                    }
                    try {
                        const manager = await this.prisma.user.findUnique({
                            where: { userID: department.managerID },
                            select: { email: true },
                        });
                        if (manager?.email) {
                            await this.emailService?.send({
                                to: manager.email,
                                subject: '[HRM] Yêu cầu nghỉ phép mới',
                                text: `Xin chào Quản lý,\n\nNhân viên ${user.username} vừa gửi đơn xin nghỉ phép từ ngày ${startDate} đến ${endDate} (${duration} ngày).\nLý do: ${reason}\n\nVui lòng truy cập hệ thống để phê duyệt.\n\nTrân trọng,\nHệ thống HRM`,
                            });
                        }
                    }
                    catch (e) {
                        console.error('Email error in createLeaveApplication:', e);
                    }
                }
            }
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: conflictDates.length
                    ? `Leave application submitted successfully with warning: work logs already exist on ${conflictDates.join(', ')}`
                    : 'Leave application submitted successfully',
                data: conflictDates.length
                    ? {
                        ...application,
                        warnings: conflictDates.map((date) => ({
                            code: 'LEAVE_WORKLOG_CONFLICT',
                            date,
                            message: 'Leave request overlaps with an existing timesheet entry.',
                        })),
                    }
                    : application,
            };
        }
        catch (error) {
            console.error('Error creating leave application:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred while creating leave application',
            };
        }
    }
    async getMyLeaveApplications(userID) {
        const applications = await this.prisma.leaveApplication.findMany({
            where: { senderID: userID },
            orderBy: { createdAt: 'desc' },
            include: { typeLeave: true },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get my leave applications successful',
            data: applications,
        };
    }
    async getDepartmentLeaveApplications(departmentID) {
        const applications = await this.prisma.leaveApplication.findMany({
            where: { sender: { departmentID } },
            orderBy: { createdAt: 'desc' },
            include: { sender: true, typeLeave: true },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get department leave applications successful',
            data: applications,
        };
    }
    async getAllLeaveApplications() {
        const applications = await this.prisma.leaveApplication.findMany({
            orderBy: { createdAt: 'desc' },
            include: { sender: true, typeLeave: true },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get all leave applications successful',
            data: applications,
        };
    }
    async reviewLeaveApplication(leaveApplicationID, reviewerID, reviewDto) {
        const { status, reasonReject } = reviewDto;
        try {
            const executeLogic = async (dbCtx) => {
                const application = await dbCtx.leaveApplication.findUnique({
                    where: { leaveApplicationID },
                    include: {
                        sender: {
                            include: {
                                department: true,
                            },
                        },
                        typeLeave: true,
                    },
                });
                if (!application) {
                    return {
                        statusCode: code_1.NOTFOUND_CODE,
                        message: 'Leave application not found',
                    };
                }
                if (application.sender?.department?.managerID !== reviewerID) {
                    return {
                        statusCode: code_1.UNAUTHORIZED_CODE,
                        message: 'Only the sender department manager can review this leave application',
                    };
                }
                const oldStatus = application.status;
                const newStatus = status.toUpperCase();
                const isPaidLeave = Number(application.typeLeave?.hasSalary ?? 0) > 0;
                if (oldStatus === newStatus) {
                    if (newStatus === client_1.LeaveStatus.REJECTED &&
                        reasonReject !== application.reasonReject) {
                        await dbCtx.leaveApplication.update({
                            where: { leaveApplicationID },
                            data: { reasonReject, reviewerID, reviewedAt: new Date() },
                        });
                        return { statusCode: code_1.OK_CODE, message: 'Rejection reason updated' };
                    }
                    return {
                        statusCode: code_1.OK_CODE,
                        message: `Leave application is already ${oldStatus}`,
                    };
                }
                if (newStatus === client_1.LeaveStatus.REJECTED && !reasonReject) {
                    return {
                        statusCode: code_1.BADREQUEST_CODE,
                        message: 'Reason for rejection is required',
                    };
                }
                const user = await dbCtx.user.findUnique({
                    where: { userID: application.senderID },
                });
                if (!user) {
                    return { statusCode: code_1.NOTFOUND_CODE, message: 'Applicant not found' };
                }
                const reviewer = await dbCtx.user.findUnique({
                    where: { userID: reviewerID },
                    select: { username: true },
                });
                const reviewerName = reviewer?.username || 'Quản lý';
                if (isPaidLeave) {
                    if (oldStatus === client_1.LeaveStatus.APPROVED &&
                        newStatus !== client_1.LeaveStatus.APPROVED) {
                        await dbCtx.user.update({
                            where: { userID: application.senderID },
                            data: {
                                remainDaysofLeave: user.remainDaysofLeave + application.duration,
                            },
                        });
                    }
                    else if (oldStatus !== client_1.LeaveStatus.APPROVED &&
                        newStatus === client_1.LeaveStatus.APPROVED) {
                        if (user.remainDaysofLeave < application.duration) {
                            return {
                                statusCode: code_1.BADREQUEST_CODE,
                                message: 'User does not have enough remaining days of leave to approve this application',
                            };
                        }
                        await dbCtx.user.update({
                            where: { userID: application.senderID },
                            data: {
                                remainDaysofLeave: user.remainDaysofLeave - application.duration,
                            },
                        });
                    }
                }
                const updatedApp = await dbCtx.leaveApplication.update({
                    where: { leaveApplicationID },
                    data: {
                        status: newStatus,
                        reasonReject: newStatus === client_1.LeaveStatus.REJECTED ? reasonReject : null,
                        reviewerID,
                        reviewedAt: new Date(),
                    },
                });
                const notificationMsg = newStatus === client_1.LeaveStatus.APPROVED
                    ? `Đơn nghỉ phép từ ${this.formatDateVi(application.startDate)} đến ${this.formatDateVi(application.endDate)} đã được duyệt.`
                    : `Đơn nghỉ phép từ ${this.formatDateVi(application.startDate)} đến ${this.formatDateVi(application.endDate)} đã bị từ chối. Lý do: ${reasonReject}`;
                await this.notificationService.createNotification(reviewerID, application.senderID, notificationMsg, client_1.NotificationRelatedType.LEAVE, dbCtx);
                if (this.emailService) {
                    this.emailService
                        .sendLeaveNotification({
                        recipientEmail: application.sender.email,
                        employeeName: application.sender.username,
                        status: newStatus === client_1.LeaveStatus.APPROVED ? 'approved' : 'rejected',
                        reason: reasonReject || undefined,
                        leaveApplicationID: application.leaveApplicationID,
                        createdAt: application.createdAt,
                        startDate: application.startDate,
                        endDate: application.endDate,
                        reviewerName: reviewerName,
                        reviewedAt: updatedApp.reviewedAt || new Date(),
                    })
                        .catch((e) => console.error('Email error in reviewLeaveApplication:', e));
                }
                return {
                    statusCode: code_1.OK_CODE,
                    message: `Leave application ${newStatus}`,
                    data: updatedApp,
                };
            };
            return await this.prisma.$transaction(executeLogic);
        }
        catch (error) {
            console.error('Error reviewing leave application:', error);
            return {
                statusCode: code_1.Interval_Server_Network_Exeception_Code,
                message: 'Internal server error occurred while reviewing leave application',
            };
        }
    }
    async getLeaveBalance(userID) {
        const user = await this.prisma.user.findUnique({ where: { userID } });
        if (!user) {
            return { statusCode: code_1.NOTFOUND_CODE, message: 'User not found' };
        }
        const applications = await this.prisma.leaveApplication.findMany({
            where: { senderID: userID },
            orderBy: { createdAt: 'desc' },
            include: { typeLeave: true },
        });
        const pendingDays = applications
            .filter((app) => app.status === client_1.LeaveStatus.PENDING &&
            Number(app.typeLeave?.hasSalary ?? 0) > 0)
            .reduce((sum, app) => sum + app.duration, 0);
        const data = {
            totalDaysOfLeave: user.totalDaysofLeave,
            remainDaysOfLeave: user.remainDaysofLeave,
            usedDays: user.totalDaysofLeave - user.remainDaysofLeave,
            pendingDays,
            history: applications,
        };
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get leave balance successful',
            data,
        };
    }
    parseDateOnly(value) {
        const [year, month, day] = value.split('-').map(Number);
        if (!year || !month || !day) {
            return new Date(value);
        }
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    startOfToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
    calculateBusinessDays(start, end) {
        let count = 0;
        const cursor = new Date(start);
        while (cursor <= end) {
            const day = cursor.getDay();
            if (day !== 0 && day !== 6) {
                count += 1;
            }
            cursor.setDate(cursor.getDate() + 1);
        }
        return count;
    }
    async findWorkLogConflictDates(userID, start, end) {
        const startKey = this.toDateKey(start);
        const endKey = this.toDateKey(end);
        const monthlyTimesheets = await this.prisma.monthlyTimesheet.findMany({
            where: {
                userID,
                entries: {
                    some: {
                        date: {
                            gte: startKey,
                            lte: endKey,
                        },
                    },
                },
            },
            include: {
                entries: {
                    where: {
                        date: {
                            gte: startKey,
                            lte: endKey,
                        },
                    },
                    select: { date: true },
                },
            },
        });
        return Array.from(new Set(monthlyTimesheets.flatMap((timesheet) => timesheet.entries.map((entry) => entry.date)))).sort();
    }
    toDateKey(value) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    formatDateVi(value) {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(value);
    }
};
exports.LeaveApplicationService = LeaveApplicationService;
exports.LeaveApplicationService = LeaveApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        email_service_1.EmailService])
], LeaveApplicationService);
//# sourceMappingURL=leave-application.service.js.map