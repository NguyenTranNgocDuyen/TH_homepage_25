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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const code_1 = require("../common/code");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async sendNotification(userID, createNotificationDto, currentUserID) {
        this.assertMe(userID, currentUserID);
        const response = await this.notificationService.sendNotification(userID, createNotificationDto);
        if (response.statusCode === code_1.CREATED_RESPONE) {
            return response;
        }
        this.throwFromResponse(response.statusCode, response.message);
    }
    async getAllMyReceviedNotifications(userID, currentUserID) {
        this.assertMe(userID, currentUserID);
        const response = await this.notificationService.getReceivedNotifications(userID);
        if (response.statusCode === code_1.OK_CODE) {
            return response;
        }
        this.throwFromResponse(response.statusCode, response.message);
    }
    async getAllMySendNotifications(userID, currentUserID) {
        this.assertMe(userID, currentUserID);
        const response = await this.notificationService.getSentNotifications(userID);
        if (response.statusCode === code_1.OK_CODE) {
            return response;
        }
        this.throwFromResponse(response.statusCode, response.message);
    }
    async markAsRead(notificationID, currentUserID) {
        const response = await this.notificationService.markAsRead(notificationID, currentUserID);
        if (response.statusCode === code_1.OK_CODE) {
            return response;
        }
        this.throwFromResponse(response.statusCode, response.message);
    }
    async getUnreadCount(userID, currentUserID) {
        this.assertMe(userID, currentUserID);
        const response = await this.notificationService.getUnreadCount(userID);
        if (response.statusCode === code_1.OK_CODE) {
            return response;
        }
        this.throwFromResponse(response.statusCode, response.message);
    }
    assertMe(userID, currentUserID) {
        if (!currentUserID || currentUserID !== userID) {
            throw new common_1.ForbiddenException('You can only access your own notifications');
        }
    }
    throwFromResponse(statusCode, message) {
        if (statusCode === code_1.NOTFOUND_CODE) {
            throw new common_1.NotFoundException(message);
        }
        if (statusCode === code_1.CONFLIG_CODE) {
            throw new common_1.ConflictException(message);
        }
        if (statusCode === code_1.UNAUTHORIZED_CODE) {
            throw new common_1.ForbiddenException(message);
        }
        throw new common_1.BadRequestException(message);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)('/sendNoti/:userID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a notification as the current user (role: me)',
    }),
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_notification_dto_1.CreateNotificationDto, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)('/received/:userID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get received notifications (role: me)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get received notifications successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAllMyReceviedNotifications", null);
__decorate([
    (0, common_1.Get)('/sent/:userID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get sent notifications (role: me)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get sent notifications successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAllMySendNotifications", null);
__decorate([
    (0, common_1.Patch)('/read/:notificationID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read (role: me)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Mark notification as read successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Notification not found' }),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('notificationID', new common_1.ParseUUIDPipe())),
    __param(1, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('/unread-count/:userID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count (role: me)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get unread count successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map