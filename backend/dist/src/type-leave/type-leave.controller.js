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
exports.TypeLeaveController = void 0;
const common_1 = require("@nestjs/common");
const type_leave_service_1 = require("./type-leave.service");
const create_type_leave_dto_1 = require("./dto/create-type-leave.dto");
const update_type_leave_dto_1 = require("./dto/update-type-leave.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const code_1 = require("../common/code");
let TypeLeaveController = class TypeLeaveController {
    typeLeaveService;
    constructor(typeLeaveService) {
        this.typeLeaveService = typeLeaveService;
    }
    async getAllTypeLeaves(includeInactive) {
        const response = await this.typeLeaveService.getAllTypeLeaves(includeInactive === 'true');
        if (response.statusCode === code_1.OK_CODE)
            return response;
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async activateTypeLeave(typeLeaveID) {
        const response = await this.typeLeaveService.setTypeLeaveActive(typeLeaveID, true);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async deactivateTypeLeave(typeLeaveID) {
        const response = await this.typeLeaveService.setTypeLeaveActive(typeLeaveID, false);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getTypeLeave(typeLeaveID) {
        const response = await this.typeLeaveService.getTypeLeave(typeLeaveID);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async createTypeLeave(createDto) {
        const response = await this.typeLeaveService.createTypeLeave(createDto);
        if (response.statusCode === code_1.CREATED_RESPONE ||
            response.statusCode === code_1.OK_CODE)
            return response;
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async updateTypeLeave(typeLeaveID, updateDto) {
        const response = await this.typeLeaveService.updateTypeLeave(typeLeaveID, updateDto);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async deleteTypeLeave(typeLeaveID) {
        const response = await this.typeLeaveService.deleteTypeLeave(typeLeaveID);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        if (response.statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
};
exports.TypeLeaveController = TypeLeaveController;
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Lấy tất cả loại nghỉ phép' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me', 'manager', 'admin'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "getAllTypeLeaves", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Kích hoạt lại loại nghỉ phép' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Patch)(':typeLeaveID/activate'),
    __param(0, (0, common_1.Param)('typeLeaveID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "activateTypeLeave", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Vô hiệu hóa loại nghỉ phép, không xóa lịch sử',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Patch)(':typeLeaveID/deactivate'),
    __param(0, (0, common_1.Param)('typeLeaveID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "deactivateTypeLeave", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Lấy chi tiết 1 loại nghỉ phép' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Get)(':typeLeaveID'),
    __param(0, (0, common_1.Param)('typeLeaveID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "getTypeLeave", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Tạo loại nghỉ phép mới' }),
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_type_leave_dto_1.CreateTypeLeaveDto]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "createTypeLeave", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Cập nhật loại nghỉ phép' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Patch)(':typeLeaveID'),
    __param(0, (0, common_1.Param)('typeLeaveID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_type_leave_dto_1.UpdateTypeLeaveDto]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "updateTypeLeave", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Vô hiệu hóa loại nghỉ phép, giữ lịch sử' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Delete)(':typeLeaveID'),
    __param(0, (0, common_1.Param)('typeLeaveID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeLeaveController.prototype, "deleteTypeLeave", null);
exports.TypeLeaveController = TypeLeaveController = __decorate([
    (0, swagger_1.ApiTags)('type-leave'),
    (0, common_1.Controller)('type-leave'),
    __metadata("design:paramtypes", [type_leave_service_1.TypeLeaveService])
], TypeLeaveController);
//# sourceMappingURL=type-leave.controller.js.map