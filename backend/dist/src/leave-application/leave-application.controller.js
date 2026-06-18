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
exports.LeaveApplicationController = void 0;
const common_1 = require("@nestjs/common");
const leave_application_service_1 = require("./leave-application.service");
const create_leave_application_dto_1 = require("./dto/create-leave-application.dto");
const review_leave_application_dto_1 = require("./dto/review-leave-application.dto");
const code_1 = require("../common/code");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
let LeaveApplicationController = class LeaveApplicationController {
    leaveApplicationService;
    constructor(leaveApplicationService) {
        this.leaveApplicationService = leaveApplicationService;
    }
    async createLeaveApplication(userID, createDto) {
        const response = await this.leaveApplicationService.createLeaveApplication(userID, createDto);
        if (response.statusCode === code_1.CREATED_RESPONE ||
            response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        if (response.statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getLeaveBalance(userID) {
        const response = await this.leaveApplicationService.getLeaveBalance(userID);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getMyLeaveApplications(userID) {
        const response = await this.leaveApplicationService.getMyLeaveApplications(userID);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getDepartmentLeaveApplications(departmentID) {
        const response = await this.leaveApplicationService.getDepartmentLeaveApplications(departmentID);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getAllLeaveApplications() {
        const response = await this.leaveApplicationService.getAllLeaveApplications();
        if (response.statusCode === code_1.OK_CODE)
            return response;
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async reviewLeaveApplication(leaveApplicationID, reviewDto, req) {
        const user = req.user;
        const reviewerID = user?.userID;
        if (!reviewerID) {
            throw new common_1.BadRequestException('User information not found in request');
        }
        const response = await this.leaveApplicationService.reviewLeaveApplication(leaveApplicationID, reviewerID, reviewDto);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        if (response.statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
};
exports.LeaveApplicationController = LeaveApplicationController;
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({ description: 'Nhân viên gửi đơn nghỉ' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, common_1.Post)('/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_leave_application_dto_1.CreateLeaveApplicationDto]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "createLeaveApplication", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({ description: 'Xem số dư phép' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me', 'manager', 'admin'),
    (0, common_1.Get)('/balance/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "getLeaveBalance", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({ description: 'Xem đơn nghỉ của mình' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, common_1.Get)('/my/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "getMyLeaveApplications", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({ description: 'Manager xem đơn của phòng' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('managerOfDepartment'),
    (0, common_1.Get)('/department/:departmentID'),
    __param(0, (0, common_1.Param)('departmentID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "getDepartmentLeaveApplications", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({ description: 'HR xem tất cả đơn' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "getAllLeaveApplications", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({ description: 'Manager duyệt/từ chối đơn nghỉ' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('manager'),
    (0, common_1.Patch)('/review/:leaveApplicationID'),
    __param(0, (0, common_1.Param)('leaveApplicationID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_leave_application_dto_1.ReviewLeaveApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "reviewLeaveApplication", null);
exports.LeaveApplicationController = LeaveApplicationController = __decorate([
    (0, swagger_1.ApiTags)('leave-application'),
    (0, common_1.Controller)('leave-application'),
    __metadata("design:paramtypes", [leave_application_service_1.LeaveApplicationService])
], LeaveApplicationController);
//# sourceMappingURL=leave-application.controller.js.map