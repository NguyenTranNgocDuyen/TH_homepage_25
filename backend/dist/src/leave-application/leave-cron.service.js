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
var LeaveCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let LeaveCronService = LeaveCronService_1 = class LeaveCronService {
    prisma;
    logger = new common_1.Logger(LeaveCronService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleAnnualLeaveReset() {
        this.logger.log('Bắt đầu cron job: Reset ngày phép hàng năm...');
        try {
            const result = await this.prisma.$executeRaw `
        UPDATE "users" 
        SET "remainDaysofLeave" = "totalDaysofLeave"
      `;
            this.logger.log(`Hoàn thành reset ngày phép. Số lượng nhân viên được cập nhật: ${result}`);
        }
        catch (error) {
            this.logger.error('Lỗi khi chạy cron job reset ngày phép:', error);
        }
    }
};
exports.LeaveCronService = LeaveCronService;
__decorate([
    (0, schedule_1.Cron)('0 0 1 1 *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveCronService.prototype, "handleAnnualLeaveReset", null);
exports.LeaveCronService = LeaveCronService = LeaveCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveCronService);
//# sourceMappingURL=leave-cron.service.js.map