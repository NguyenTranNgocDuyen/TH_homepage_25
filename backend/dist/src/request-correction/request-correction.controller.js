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
exports.RequestCorrectionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_guard_1 = require("../auth/guards/access.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const code_1 = require("../common/code");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const client_1 = require("@prisma/client");
const create_request_correction_dto_1 = require("./dto/create-request-correction.dto");
const review_request_correction_dto_1 = require("./dto/review-request-correction.dto");
const request_correction_service_1 = require("./request-correction.service");
let RequestCorrectionController = class RequestCorrectionController {
    requestCorrectionService;
    constructor(requestCorrectionService) {
        this.requestCorrectionService = requestCorrectionService;
    }
    async createCorrection(userID, dto) {
        const response = await this.requestCorrectionService.createRequest(userID, dto);
        return this.returnOrThrow(response);
    }
    async getMyCorrections(userID) {
        const response = await this.requestCorrectionService.getMyRequests(userID);
        return this.returnOrThrow(response);
    }
    async getDepartmentCorrections(departmentID, status = 'pending') {
        const normalizedStatus = this.parseTimesheetStatus(status);
        const response = await this.requestCorrectionService.getDepartmentRequests(departmentID, normalizedStatus);
        return this.returnOrThrow(response);
    }
    async reviewCorrection(requestCorrectionID, dto, request) {
        const reviewerID = request.user?.userID;
        if (!reviewerID) {
            throw new common_1.BadRequestException('User information not found in request');
        }
        const response = await this.requestCorrectionService.reviewRequest(requestCorrectionID, reviewerID, dto);
        return this.returnOrThrow(response);
    }
    parseTimesheetStatus(status) {
        const normalizedStatus = String(status || client_1.TimesheetStatus.PENDING)
            .trim()
            .toUpperCase();
        if (Object.values(client_1.TimesheetStatus).includes(normalizedStatus)) {
            return normalizedStatus;
        }
        throw new common_1.BadRequestException(`Invalid correction status: ${status}`);
    }
    returnOrThrow(response) {
        if (response.statusCode === code_1.OK_CODE ||
            response.statusCode === code_1.CREATED_RESPONE) {
            return response;
        }
        if (response.statusCode === code_1.NOTFOUND_CODE) {
            throw new common_1.NotFoundException(response.message);
        }
        if (response.statusCode === code_1.CONFLIG_CODE) {
            throw new common_1.ConflictException(response.message);
        }
        throw new common_1.BadRequestException(response.message);
    }
};
exports.RequestCorrectionController = RequestCorrectionController;
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Employee creates a correction request for their monthly timesheet or entry',
    }),
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, common_1.Post)('/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_request_correction_dto_1.CreateRequestCorrectionDto]),
    __metadata("design:returntype", Promise)
], RequestCorrectionController.prototype, "createCorrection", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Employee views their correction requests' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, common_1.Get)('/my/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestCorrectionController.prototype, "getMyCorrections", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Manager views pending correction requests in their department',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('managerOfDepartment', 'admin'),
    (0, common_1.Get)('/department/:departmentID'),
    __param(0, (0, common_1.Param)('departmentID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestCorrectionController.prototype, "getDepartmentCorrections", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Manager approves or rejects a correction request',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('manager', 'admin'),
    (0, common_1.Patch)('/review/:requestCorrectionID'),
    __param(0, (0, common_1.Param)('requestCorrectionID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_request_correction_dto_1.ReviewRequestCorrectionDto, Object]),
    __metadata("design:returntype", Promise)
], RequestCorrectionController.prototype, "reviewCorrection", null);
exports.RequestCorrectionController = RequestCorrectionController = __decorate([
    (0, swagger_1.ApiTags)('request-correction'),
    (0, common_1.Controller)('request-correction'),
    __metadata("design:paramtypes", [request_correction_service_1.RequestCorrectionService])
], RequestCorrectionController);
//# sourceMappingURL=request-correction.controller.js.map