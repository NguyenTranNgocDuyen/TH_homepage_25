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
exports.WarningService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
const code_1 = require("../common/code");
const notification_service_1 = require("../notification/notification.service");
const client_1 = require("@prisma/client");
let WarningService = class WarningService {
    userService;
    prismaService;
    notificationService;
    constructor(userService, prismaService, notificationService) {
        this.userService = userService;
        this.prismaService = prismaService;
        this.notificationService = notificationService;
    }
    async sendWarning(createWarningDto) {
        const { userID, content, level } = createWarningDto;
        return await this.prismaService.$transaction(async (tx) => {
            const userGet = await this.userService.getUserByUserID(userID, tx);
            if (userGet.statusCode !== code_1.OK_CODE || userGet.data === undefined)
                return {
                    statusCode: userGet.statusCode,
                    message: userGet.message,
                };
            const warning = await tx.warning.create({
                data: {
                    userID,
                    content,
                    level: level || client_1.WarningLevel.LOW,
                },
            });
            const notification = await this.notificationService.createNotification('system', userID, `You have received a warning: ${content}`, client_1.NotificationRelatedType.WARNING, tx);
            if (notification.statusCode !== code_1.CREATED_RESPONE) {
                return {
                    statusCode: notification.statusCode,
                    message: notification.message,
                };
            }
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: 'Created warning successfull !!!!',
                data: warning,
            };
        });
    }
};
exports.WarningService = WarningService;
exports.WarningService = WarningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], WarningService);
//# sourceMappingURL=warning.service.js.map