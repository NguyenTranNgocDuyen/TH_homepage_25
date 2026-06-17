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
exports.SystemLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../prisma/prisma.service");
const realtime_service_1 = require("../../realtime/realtime.service");
let SystemLogInterceptor = class SystemLogInterceptor {
    prisma;
    realtimeService;
    constructor(prisma, realtimeService) {
        this.prisma = prisma;
        this.realtimeService = realtimeService;
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        if (request.method === 'GET' || request.method === 'OPTIONS') {
            return next.handle();
        }
        const { ip, method, originalUrl, user, body, params } = request;
        const response = ctx.getResponse();
        const safeBody = { ...body };
        if (safeBody.password)
            safeBody.password = '***';
        if (safeBody.newPassword)
            safeBody.newPassword = '***';
        if (safeBody.oldPassword)
            safeBody.oldPassword = '***';
        const logToDatabase = async (statusCode, responseMessage, resData) => {
            try {
                const entity = originalUrl.split('?')[0];
                const entityID = params.id ||
                    params.userID ||
                    params.departmentID ||
                    params.roleID ||
                    null;
                const logUserID = user?.userID ||
                    resData?.data?.user?.userID ||
                    resData?.user?.userID ||
                    resData?.data?.userID ||
                    resData?.userID ||
                    null;
                const newLog = await this.prisma.systemLog.create({
                    data: {
                        action: method,
                        entity: entity,
                        entityID: entityID,
                        details: JSON.stringify({ path: originalUrl, body: safeBody }),
                        ipAddress: ip || null,
                        userID: logUserID,
                        statusCode: statusCode,
                        responseMessage: responseMessage,
                    },
                });
                if (this.realtimeService) {
                    this.realtimeService.emitToAdmin('new_system_log', newLog);
                }
            }
            catch (error) {
                console.error('Lỗi khi ghi log hệ thống:', error);
            }
        };
        return next.handle().pipe((0, operators_1.tap)({
            next: (resData) => {
                const statusCode = resData?.statusCode || response.statusCode;
                const message = resData?.message || 'Success';
                logToDatabase(statusCode, message, resData).catch(console.error);
            },
            error: (err) => {
                const statusCode = err instanceof common_1.HttpException ? err.getStatus() : 500;
                const message = err.message || 'Internal Server Error';
                logToDatabase(statusCode, message).catch(console.error);
            },
        }));
    }
};
exports.SystemLogInterceptor = SystemLogInterceptor;
exports.SystemLogInterceptor = SystemLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_service_1.RealtimeService])
], SystemLogInterceptor);
//# sourceMappingURL=system-log.interceptor.js.map