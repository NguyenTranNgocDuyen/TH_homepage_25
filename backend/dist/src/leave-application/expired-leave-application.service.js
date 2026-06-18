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
var ExpiredLeaveApplicationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiredLeaveApplicationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpiredLeaveApplicationService = ExpiredLeaveApplicationService_1 = class ExpiredLeaveApplicationService {
    prisma;
    notificationService;
    logger = new common_1.Logger(ExpiredLeaveApplicationService_1.name);
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async onModuleInit() {
        await this.cancelOverduePendingLeaves(this.endOfYesterday(), 'startup');
    }
    async cancelPendingLeavesAtEndOfDay() {
        await this.cancelOverduePendingLeaves(this.endOfToday(), 'daily-cron');
    }
    async cancelOverduePendingLeaves(cutoff, source = 'manual') {
        const expiredApplications = await this.prisma.leaveApplication.findMany({
            where: {
                status: client_1.LeaveStatus.PENDING,
                endDate: {
                    lte: cutoff,
                },
            },
        });
        if (expiredApplications.length === 0) {
            this.logger.log(`[${source}] No overdue pending leave applications before ${cutoff.toISOString()}.`);
            return 0;
        }
        const reason = 'Tự động hủy do đơn nghỉ phép đã hết ngày nghỉ nhưng vẫn chưa được duyệt.';
        await this.prisma.$transaction(async (tx) => {
            for (const application of expiredApplications) {
                await tx.leaveApplication.update({
                    where: { leaveApplicationID: application.leaveApplicationID },
                    data: {
                        status: client_1.LeaveStatus.CANCELLED,
                        reasonReject: reason,
                        reviewedAt: new Date(),
                    },
                });
                await this.notificationService.createNotification('system', application.senderID, `Đơn nghỉ phép từ ${this.formatDateKey(application.startDate)} đến ${this.formatDateKey(application.endDate)} đã tự động hủy vì quá hạn duyệt.`, client_1.NotificationRelatedType.LEAVE, tx);
            }
        }, { timeout: 30000 });
        this.logger.log(`[${source}] Cancelled ${expiredApplications.length} overdue pending leave applications.`);
        return expiredApplications.length;
    }
    endOfToday() {
        const date = new Date();
        date.setHours(23, 59, 59, 999);
        return date;
    }
    endOfYesterday() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(23, 59, 59, 999);
        return date;
    }
    formatDateKey(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }
};
exports.ExpiredLeaveApplicationService = ExpiredLeaveApplicationService;
__decorate([
    (0, schedule_1.Cron)('59 59 23 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpiredLeaveApplicationService.prototype, "cancelPendingLeavesAtEndOfDay", null);
exports.ExpiredLeaveApplicationService = ExpiredLeaveApplicationService = ExpiredLeaveApplicationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ExpiredLeaveApplicationService);
//# sourceMappingURL=expired-leave-application.service.js.map