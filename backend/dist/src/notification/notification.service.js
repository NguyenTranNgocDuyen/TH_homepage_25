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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const code_1 = require("../common/code");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
const realtime_service_1 = require("../realtime/realtime.service");
const SYSTEM_SENDER_ID = 'system';
let NotificationService = class NotificationService {
    userService;
    prismaService;
    realtimeService;
    constructor(userService, prismaService, realtimeService) {
        this.userService = userService;
        this.prismaService = prismaService;
        this.realtimeService = realtimeService;
    }
    async sendNotification(senderID, createNotificationDto, tx) {
        const { receiverID, content } = createNotificationDto;
        return this.createNotification(senderID, receiverID, content, undefined, tx);
    }
    async getReceivedNotifications(userID) {
        try {
            const user = await this.userService.getUserByUserID(userID);
            if (user.statusCode !== code_1.OK_CODE || !user.data) {
                return { statusCode: user.statusCode, message: 'User not found' };
            }
            const notifications = await this.prismaService.notification.findMany({
                where: { receiverID: userID },
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            userID: true,
                            username: true,
                            email: true,
                            linkAvatar: true,
                        },
                    },
                },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Get received notifications successfully',
                data: notifications,
            };
        }
        catch (error) {
            console.error('Error in getReceivedNotifications:', error);
            return code_1.ANOTHER_ERROR_RESPONE;
        }
    }
    async getSentNotifications(userID) {
        try {
            const user = await this.userService.getUserByUserID(userID);
            if (user.statusCode !== code_1.OK_CODE || !user.data) {
                return { statusCode: user.statusCode, message: 'User not found' };
            }
            const notifications = await this.prismaService.notification.findMany({
                where: { senderID: userID },
                orderBy: { createdAt: 'desc' },
                include: {
                    receiver: {
                        select: {
                            userID: true,
                            username: true,
                            email: true,
                            linkAvatar: true,
                        },
                    },
                },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Get sent notifications successfully',
                data: notifications,
            };
        }
        catch (error) {
            console.error('Error in getSentNotifications:', error);
            return code_1.ANOTHER_ERROR_RESPONE;
        }
    }
    async markAsRead(notificationID, receiverID) {
        try {
            const notification = await this.prismaService.notification.findUnique({
                where: { notificationID },
                include: {
                    sender: {
                        select: {
                            userID: true,
                            username: true,
                            email: true,
                            linkAvatar: true,
                        },
                    },
                },
            });
            if (!notification) {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Notification not found',
                };
            }
            if (receiverID && notification.receiverID !== receiverID) {
                return {
                    statusCode: code_1.UNAUTHORIZED_CODE,
                    message: 'You can only mark your own notifications as read',
                };
            }
            if (notification.isRead) {
                return {
                    statusCode: code_1.OK_CODE,
                    message: 'Notification already read',
                    data: notification,
                };
            }
            const updatedNotification = await this.prismaService.notification.update({
                where: { notificationID },
                data: { isRead: true },
                include: {
                    sender: {
                        select: {
                            userID: true,
                            username: true,
                            email: true,
                            linkAvatar: true,
                        },
                    },
                },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Mark notification as read successfully',
                data: updatedNotification,
            };
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2025') {
                return {
                    statusCode: code_1.NOTFOUND_CODE,
                    message: 'Notification not found',
                };
            }
            console.error('Error in markAsRead:', error);
            return code_1.ANOTHER_ERROR_RESPONE;
        }
    }
    async getUnreadCount(userID) {
        try {
            const user = await this.userService.getUserByUserID(userID);
            if (user.statusCode !== code_1.OK_CODE || !user.data) {
                return { statusCode: user.statusCode, message: 'User not found' };
            }
            const count = await this.prismaService.notification.count({
                where: {
                    receiverID: userID,
                    isRead: false,
                },
            });
            return {
                statusCode: code_1.OK_CODE,
                message: 'Get unread count successfully',
                data: { count },
            };
        }
        catch (error) {
            console.error('Error in getUnreadCount:', error);
            return code_1.ANOTHER_ERROR_RESPONE;
        }
    }
    async createNotification(senderID, receiverID, content, relatedType, tx) {
        try {
            const executeLogic = async (dbCtx) => {
                const normalizedSenderID = senderID === SYSTEM_SENDER_ID ? null : senderID;
                const receiver = await dbCtx.user.findUnique({
                    where: { userID: receiverID },
                    select: { userID: true },
                });
                if (!receiver) {
                    return { statusCode: code_1.NOTFOUND_CODE, message: 'Receiver not found' };
                }
                if (normalizedSenderID) {
                    const sender = await dbCtx.user.findUnique({
                        where: { userID: normalizedSenderID },
                        select: { userID: true },
                    });
                    if (!sender) {
                        return { statusCode: code_1.NOTFOUND_CODE, message: 'Sender not found' };
                    }
                }
                const notificationData = {
                    receiverID,
                    content,
                    relatedType,
                };
                if (normalizedSenderID) {
                    notificationData.senderID = normalizedSenderID;
                }
                const newNotification = await dbCtx.notification.create({
                    data: notificationData,
                });
                return {
                    statusCode: code_1.CREATED_RESPONE,
                    message: 'Create notification successfully',
                    data: newNotification,
                };
            };
            let result;
            if (tx) {
                result = await executeLogic(tx);
            }
            else {
                result = await this.prismaService.$transaction(async (tx) => executeLogic(tx), { timeout: 30000 });
            }
            if (result.statusCode === code_1.CREATED_RESPONE && result.data) {
                this.realtimeService.emitToUser(receiverID, 'new_notification', result.data);
            }
            return result;
        }
        catch (error) {
            console.error('Error in createNotification:', error);
            return code_1.ANOTHER_ERROR_RESPONE;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        prisma_service_1.PrismaService,
        realtime_service_1.RealtimeService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map