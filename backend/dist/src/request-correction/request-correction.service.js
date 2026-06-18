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
exports.RequestCorrectionService = void 0;
const common_1 = require("@nestjs/common");
const code_1 = require("../common/code");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
const email_service_1 = require("../common/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
let RequestCorrectionService = class RequestCorrectionService {
    prisma;
    notificationService;
    emailService;
    constructor(prisma, notificationService, emailService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }
    async createRequest(userID, dto) {
        const reason = dto.reason?.trim();
        if (!reason) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Correction reason is required',
            };
        }
        return this.prisma.$transaction(async (tx) => {
            const timesheet = await tx.monthlyTimesheet.findUnique({
                where: { monthlyTimesheetID: dto.monthlyTimesheetID },
                include: {
                    employee: { include: { department: true } },
                },
            });
            if (!timesheet) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Monthly timesheet not found',
                };
            }
            if (timesheet.userID !== userID) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Cannot create correction for another employee',
                };
            }
            if (timesheet.status === client_1.MonthlyTimesheetStatus.APPROVED) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Approved monthly timesheet is locked',
                };
            }
            if (timesheet.status === client_1.MonthlyTimesheetStatus.SUBMITTED) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Submitted monthly timesheet is waiting for review',
                };
            }
            const managerID = timesheet.employee.department?.managerID;
            if (!managerID) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Employee department does not have a manager',
                };
            }
            const entry = dto.timesheetEntryID
                ? await tx.timesheetEntry.findUnique({
                    where: { timesheetEntryID: dto.timesheetEntryID },
                })
                : null;
            if (dto.timesheetEntryID && !entry) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Timesheet entry not found',
                };
            }
            if (entry &&
                entry.monthlyTimesheetID !== timesheet.monthlyTimesheetID) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Timesheet entry does not belong to this monthly timesheet',
                };
            }
            const dateKey = dto.date || entry?.date;
            const proposedCheckIn = this.parseProposedDateTime(dto.requestedCheckIn, dateKey);
            const proposedCheckOut = this.parseProposedDateTime(dto.requestedCheckOut, dateKey);
            if ((proposedCheckIn || proposedCheckOut) && !entry) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Timesheet entry is required when proposing check-in/out changes',
                };
            }
            const nextCheckIn = proposedCheckIn || entry?.checkIn || null;
            const nextCheckOut = proposedCheckOut || entry?.checkOut || null;
            if (proposedCheckIn && proposedCheckIn.getHours() < 6) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Proposed check-in must be 06:00 AM or later',
                };
            }
            if (nextCheckIn && nextCheckOut && nextCheckOut <= nextCheckIn) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Proposed check-out must be after check-in',
                };
            }
            const duplicatePending = await tx.requestCorrection.findFirst({
                where: {
                    userID,
                    monthlyTimesheetID: timesheet.monthlyTimesheetID,
                    timesheetEntryID: entry?.timesheetEntryID ?? null,
                    status: client_1.TimesheetStatus.PENDING,
                },
            });
            if (duplicatePending) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'A pending correction already exists for this entry',
                };
            }
            const request = await tx.requestCorrection.create({
                data: {
                    monthlyTimesheetID: timesheet.monthlyTimesheetID,
                    timesheetEntryID: entry?.timesheetEntryID,
                    userID,
                    reviewerID: managerID,
                    reason,
                    status: client_1.TimesheetStatus.PENDING,
                    proposedCheckIn,
                    proposedCheckOut,
                },
                include: this.defaultInclude(),
            });
            await this.recalculateCanSubmit(timesheet.monthlyTimesheetID, tx);
            const notification = await this.notificationService.createNotification(userID, managerID, `${timesheet.employee.username} đã gửi yêu cầu chỉnh sửa bảng công tháng ${timesheet.month}/${timesheet.year}.`, client_1.NotificationRelatedType.TIMESHEET, tx);
            if (notification.statusCode !== code_1.CREATED_RESPONE) {
                return {
                    statusCode: notification.statusCode,
                    message: notification.message,
                };
            }
            try {
                const manager = await tx.user.findUnique({
                    where: { userID: managerID },
                    select: { email: true },
                });
                if (manager?.email) {
                    await this.emailService.send({
                        to: manager.email,
                        subject: '[HRM] Yêu cầu chỉnh sửa công mới',
                        text: `Xin chào Quản lý,\n\nNhân viên ${timesheet.employee.username} vừa gửi yêu cầu chỉnh sửa công.\nLý do: ${reason}\n\nVui lòng truy cập hệ thống để phê duyệt.\n\nTrân trọng,\nHệ thống HRM`,
                    });
                }
            }
            catch (e) {
                console.error('Email error in createRequest (Correction):', e);
            }
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: 'Correction request created successfully',
                data: request,
            };
        }, { timeout: 30000 });
    }
    async getDepartmentRequests(departmentID, status = client_1.TimesheetStatus.PENDING) {
        const requests = await this.prisma.requestCorrection.findMany({
            where: {
                status,
                monthlyTimesheet: {
                    employee: {
                        departmentID,
                    },
                },
            },
            include: this.defaultInclude(),
            orderBy: { createdAt: 'desc' },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get correction requests successfully',
            data: requests,
        };
    }
    async getMyRequests(userID) {
        const requests = await this.prisma.requestCorrection.findMany({
            where: { userID },
            include: this.defaultInclude(),
            orderBy: { createdAt: 'desc' },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Get my correction requests successfully',
            data: requests,
        };
    }
    async reviewRequest(requestCorrectionID, reviewerID, dto) {
        const reasonReject = dto.reasonReject?.trim();
        if (dto.status === client_1.TimesheetStatus.REJECTED && !reasonReject) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Reason for rejection is required',
            };
        }
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.requestCorrection.findUnique({
                where: { requestCorrectionID },
                include: this.defaultInclude(),
            });
            if (!request) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Correction request not found',
                };
            }
            if (request.status !== client_1.TimesheetStatus.PENDING) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Correction request has already been reviewed',
                };
            }
            const canReview = await this.canReviewRequest(reviewerID, request.monthlyTimesheet.userID, tx);
            if (!canReview) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Only department manager or admin can review this correction',
                };
            }
            if (request.monthlyTimesheet.status === client_1.MonthlyTimesheetStatus.APPROVED) {
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'Approved monthly timesheet is locked',
                };
            }
            const reviewedAt = new Date();
            if (dto.status === client_1.TimesheetStatus.APPROVED) {
                await this.applyApprovedCorrection(request, tx);
            }
            const updatedRequest = await tx.requestCorrection.update({
                where: { requestCorrectionID },
                data: {
                    status: dto.status,
                    reasonReject: dto.status === client_1.TimesheetStatus.REJECTED ? reasonReject : null,
                    reviewerID,
                    reviewedAt,
                },
                include: this.defaultInclude(),
            });
            await this.recalculateCanSubmit(request.monthlyTimesheetID, tx);
            const notification = await this.notificationService.createNotification(reviewerID, request.userID, dto.status === client_1.TimesheetStatus.APPROVED
                ? 'Yêu cầu chỉnh sửa bảng công của bạn đã được duyệt.'
                : `Yêu cầu chỉnh sửa bảng công của bạn đã bị từ chối. Lý do: ${reasonReject}`, client_1.NotificationRelatedType.TIMESHEET, tx);
            if (notification.statusCode !== code_1.CREATED_RESPONE) {
                return {
                    statusCode: notification.statusCode,
                    message: notification.message,
                };
            }
            try {
                const formatTime = (date) => {
                    if (!date)
                        return '---';
                    return date.toLocaleTimeString('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                };
                await this.emailService.sendCorrectionNotification({
                    recipientEmail: request.employee.email,
                    employeeName: request.employee.username,
                    status: dto.status === client_1.TimesheetStatus.APPROVED ? 'approved' : 'rejected',
                    reason: reasonReject || undefined,
                    correctionID: updatedRequest.requestCorrectionID,
                    date: updatedRequest.timesheetEntry?.date || 'Không xác định',
                    oldCheckIn: formatTime(updatedRequest.timesheetEntry?.checkIn),
                    oldCheckOut: formatTime(updatedRequest.timesheetEntry?.checkOut),
                    proposedCheckIn: formatTime(updatedRequest.proposedCheckIn),
                    proposedCheckOut: formatTime(updatedRequest.proposedCheckOut),
                    createdAt: updatedRequest.createdAt,
                    reviewerName: updatedRequest.reviewer?.username || 'Quản lý',
                    reviewedAt: updatedRequest.reviewedAt || new Date(),
                });
            }
            catch (e) {
                console.error('Email error in reviewRequest (Correction):', e);
            }
            return {
                statusCode: code_1.OK_CODE,
                message: `Correction request ${dto.status}`,
                data: updatedRequest,
            };
        }, { timeout: 30000 });
    }
    async recalculateCanSubmit(monthlyTimesheetID, tx) {
        const db = tx ?? this.prisma;
        const timesheet = await db.monthlyTimesheet.findUnique({
            where: { monthlyTimesheetID },
            include: {
                entries: true,
                corrections: {
                    where: { status: client_1.TimesheetStatus.PENDING },
                },
            },
        });
        if (!timesheet) {
            return false;
        }
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
    async canReviewRequest(reviewerID, requesterID, tx) {
        const reviewer = await tx.user.findUnique({
            where: { userID: reviewerID },
            select: {
                role: { select: { nameRole: true } },
            },
        });
        if (!reviewer) {
            return false;
        }
        const roleName = reviewer.role.nameRole.toLowerCase();
        if (roleName === 'admin' || roleName === 'hr') {
            return true;
        }
        const requester = await tx.user.findUnique({
            where: { userID: requesterID },
            select: { department: { select: { managerID: true } } },
        });
        return requester?.department?.managerID === reviewerID;
    }
    async applyApprovedCorrection(request, tx) {
        if (!request.timesheetEntryID ||
            (!request.proposedCheckIn && !request.proposedCheckOut)) {
            return;
        }
        const entry = await tx.timesheetEntry.findUnique({
            where: { timesheetEntryID: request.timesheetEntryID },
        });
        if (!entry) {
            throw new common_1.BadRequestException('Timesheet entry not found');
        }
        const nextCheckIn = request.proposedCheckIn || entry.checkIn;
        const nextCheckOut = request.proposedCheckOut || entry.checkOut;
        if (nextCheckOut && nextCheckOut <= nextCheckIn) {
            throw new common_1.BadRequestException('Corrected check-out must be after check-in');
        }
        await tx.timesheetEntry.update({
            where: { timesheetEntryID: entry.timesheetEntryID },
            data: {
                checkIn: nextCheckIn,
                checkOut: nextCheckOut,
                status: client_1.TimesheetStatus.PENDING,
            },
        });
    }
    parseProposedDateTime(value, dateKey) {
        const normalizedValue = value?.trim();
        if (!normalizedValue) {
            return null;
        }
        const dateTimeValue = /^\d{2}:\d{2}(:\d{2})?$/.test(normalizedValue)
            ? `${dateKey || ''}T${normalizedValue.length === 5 ? `${normalizedValue}:00` : normalizedValue}`
            : normalizedValue;
        if (!dateTimeValue || dateTimeValue.startsWith('T')) {
            throw new common_1.BadRequestException('Correction date is required when using HH:mm time');
        }
        const parsed = new Date(dateTimeValue);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException('Invalid proposed correction time');
        }
        return parsed;
    }
    defaultInclude() {
        return {
            monthlyTimesheet: {
                include: {
                    employee: {
                        select: {
                            userID: true,
                            email: true,
                            username: true,
                            departmentID: true,
                            department: true,
                        },
                    },
                },
            },
            timesheetEntry: true,
            employee: {
                select: {
                    userID: true,
                    email: true,
                    username: true,
                    departmentID: true,
                },
            },
            reviewer: {
                select: {
                    userID: true,
                    email: true,
                    username: true,
                },
            },
        };
    }
};
exports.RequestCorrectionService = RequestCorrectionService;
exports.RequestCorrectionService = RequestCorrectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        email_service_1.EmailService])
], RequestCorrectionService);
//# sourceMappingURL=request-correction.service.js.map