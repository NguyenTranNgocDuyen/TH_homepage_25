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
exports.SystemLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SystemLogService = class SystemLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllLogs(limit = 200, skip = 0, startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            const createdAtFilter = {};
            if (startDate) {
                createdAtFilter.gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                createdAtFilter.lte = end;
            }
            where.createdAt = createdAtFilter;
        }
        const logs = await this.prisma.systemLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                        linkAvatar: true,
                    },
                },
            },
        });
        const total = await this.prisma.systemLog.count({ where });
        return {
            statusCode: 200,
            message: 'Lấy nhật ký hệ thống thành công',
            data: {
                logs,
                total,
                limit,
                skip,
            },
        };
    }
    async toggleAnomaly(logID) {
        const log = await this.prisma.systemLog.findUnique({ where: { logID } });
        if (!log) {
            return { statusCode: 404, message: 'Log không tồn tại' };
        }
        const updatedLog = await this.prisma.systemLog.update({
            where: { logID },
            data: { isAnomalous: !log.isAnomalous },
        });
        return {
            statusCode: 200,
            message: 'Đã cập nhật trạng thái log',
            data: updatedLog,
        };
    }
};
exports.SystemLogService = SystemLogService;
exports.SystemLogService = SystemLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemLogService);
//# sourceMappingURL=system-log.service.js.map