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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const swagger_1 = require("@nestjs/swagger");
const code_1 = require("../common/code");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async create(createRoleDto) {
        console.log('Inide role.controller.create()');
        const { statusCode, message, data } = await this.roleService.create(createRoleDto);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        else if (statusCode === code_1.CREATED_RESPONE) {
            return {
                statusCode,
                message,
                data,
            };
        }
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async findAll() {
        const { statusCode, message, data } = await this.roleService.findAll();
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async findOne(id) {
        const { statusCode, message, data } = await this.roleService.findOne(id);
        if (statusCode === code_1.NOTFOUND_CODE) {
            throw new common_1.NotFoundException('Role id is not exist ');
        }
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async update(id, updateRoleDto) {
        const response = await this.roleService.update(id, updateRoleDto);
        const { statusCode, message, data } = response;
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode == code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async remove(id) {
        const { statusCode, message } = await this.roleService.remove(id);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        throw new common_1.BadRequestException(message);
    }
    async getRoleBYNameRole(nameRole) {
        const { statusCode, message, data } = await this.roleService.getRoleByRoleName(nameRole);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(`The nameRole = ${nameRole} is not found`);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(message);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Create Role successfull',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Name role existed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, swagger_1.ApiOkResponse)({
        description: 'Get all roles successfull',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Get role id  = ?? successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Role id is not exist',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation failed (uuid is expected)',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, common_1.Get)('getRoleByID/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Update  role have id  = ?? successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Role id is not exist',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'update role not successfully',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: "The role's name must be unique",
    }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Delete role have id  = ?? successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Role id is not exist',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation failed (uuid is expected)',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, common_1.Get)('/getRoleByNameRole/:nameRole'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, swagger_1.ApiOkResponse)({
        description: 'get role successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The nameRole = ?? is not found',
    }),
    __param(0, (0, common_1.Param)('nameRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRoleBYNameRole", null);
exports.RoleController = RoleController = __decorate([
    (0, common_1.Controller)('role'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map