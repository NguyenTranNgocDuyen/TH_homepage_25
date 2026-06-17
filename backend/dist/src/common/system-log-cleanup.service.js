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
var SystemLogCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let SystemLogCleanupService = SystemLogCleanupService_1 = class SystemLogCleanupService {
    prisma;
    logger = new common_1.Logger(SystemLogCleanupService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleCron() {
        this.logger.log('Đang bắt đầu dọn dẹp các system log cũ hơn 6 tháng...');
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const result = await this.prisma.systemLog.deleteMany({
                where: {
                    createdAt: {
                        lt: sixMonthsAgo,
                    },
                },
            });
            this.logger.log(`Đã xóa thành công ${result.count} system log cũ.`);
        }
        catch (error) {
            this.logger.error('Lỗi khi cố gắng xóa system log cũ:', error);
        }
    }
};
exports.SystemLogCleanupService = SystemLogCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemLogCleanupService.prototype, "handleCron", null);
exports.SystemLogCleanupService = SystemLogCleanupService = SystemLogCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemLogCleanupService);
//# sourceMappingURL=system-log-cleanup.service.js.map