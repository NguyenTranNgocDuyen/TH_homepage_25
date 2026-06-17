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
exports.MissedCheckoutTask = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const attendance_module_service_1 = require("./attendance-module.service");
const email_service_1 = require("../common/email.service");
const client_1 = require("@prisma/client");
const warning_service_1 = require("../warning/warning.service");
const code_1 = require("../common/code");
let MissedCheckoutTask = class MissedCheckoutTask {
    prismaService;
    attendanceService;
    warningService;
    emailService;
    constructor(prismaService, attendanceService, warningService, emailService) {
        this.prismaService = prismaService;
        this.attendanceService = attendanceService;
        this.warningService = warningService;
        this.emailService = emailService;
    }
    async processMissingCheckouts() {
        const now = new Date();
        const todayStr = this.formatDateKey(now);
        console.log(`[MissedCheckoutTask] Cron triggered at ${now.toISOString()} - Processing entries before ${todayStr}`);
        const result = await this.attendanceService.GetAllEmployeeDidNotCheckOutBefore(todayStr);
        if (result.statusCode !== code_1.OK_CODE || !result.data) {
            return { statusCode: result.statusCode, message: result.message };
        }
        const missedEntries = result.data;
        console.log(`[MissedCheckoutTask] Found ${missedEntries.length} missed check-out entries.`);
        for (const entry of missedEntries) {
            try {
                await this.prismaService.$transaction(async (tx) => {
                    await tx.timesheetEntry.update({
                        where: { timesheetEntryID: entry.timesheetEntryID },
                        data: {
                            status: client_1.TimesheetStatus.MISSING_OUT,
                            isWarning: true,
                        },
                    });
                    const employee = entry.monthlyTimesheet.employee;
                    await this.warningService.sendWarning({
                        userID: employee.userID,
                        content: `Hệ thống ghi nhận bạn quên check-out ngày ${entry.date}. Vui lòng tạo yêu cầu giải trình/chỉnh sửa.`,
                    });
                    try {
                        await this.emailService.send({
                            to: employee.email,
                            subject: '[HRM] Cảnh báo quên Check-out',
                            text: `Xin chào ${employee.username},\n\nHệ thống ghi nhận bạn quên check-out ngày ${entry.date}.\nTrạng thái công ngày này đã được chuyển sang "Missing Out".\nBạn sẽ không thể nộp bảng công tháng này cho đến khi giải trình xong.\nVui lòng truy cập hệ thống để tạo yêu cầu chỉnh sửa (Request Correction).\n\nTrân trọng,\nHệ thống HRM`,
                        });
                    }
                    catch (emailErr) {
                        console.error(`[MissedCheckoutTask] Failed to send email to ${employee.email}`, emailErr);
                    }
                    await tx.monthlyTimesheet.update({
                        where: { monthlyTimesheetID: entry.monthlyTimesheetID },
                        data: { canSubmit: false },
                    });
                });
            }
            catch (err) {
                console.error(`[MissedCheckoutTask] Error processing entry ${entry.timesheetEntryID}:`, err);
            }
        }
        return {
            statusCode: code_1.CREATED_RESPONE,
            message: `Processed ${missedEntries.length} missed check-out entries successfully.`,
        };
    }
    formatDateKey(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }
};
exports.MissedCheckoutTask = MissedCheckoutTask;
__decorate([
    (0, schedule_1.Cron)('0 0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MissedCheckoutTask.prototype, "processMissingCheckouts", null);
exports.MissedCheckoutTask = MissedCheckoutTask = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        attendance_module_service_1.AttendanceModuleService,
        warning_service_1.WarningService,
        email_service_1.EmailService])
], MissedCheckoutTask);
//# sourceMappingURL=missedCheckout.js.map