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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const common_1 = require("@nestjs/common");
const department_service_1 = require("./department.service");
const swagger_1 = require("@nestjs/swagger");
const createDepartment_dto_1 = __importDefault(require("./dto/createDepartment.dto"));
const code_1 = require("../common/code");
const update_department_dto_1 = __importDefault(require("./dto/update-department.dto"));
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_service_1 = require("../user/user.service");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
let DepartmentController = class DepartmentController {
    departmentService;
    userService;
    constructor(departmentService, userService) {
        this.departmentService = departmentService;
        this.userService = userService;
    }
    async findAll() {
        const { statusCode, message, data } = await this.departmentService.findAll();
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async getDepartmentById(departmentID) {
        const { statusCode, message, data } = await this.departmentService.getDepartmentById(departmentID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async createDepartment(createDepartmentDto) {
        const { statusCode, message, data } = await this.departmentService.createDepartment(createDepartmentDto);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException({
                message,
            });
        if (statusCode === code_1.NOTFOUND_CODE) {
            throw new common_1.NotFoundException(message);
        }
        if (statusCode === code_1.BADREQUEST_CODE) {
            throw new common_1.BadRequestException({
                message,
            });
        }
        else if (statusCode === code_1.CREATED_RESPONE)
            return {
                statusCode,
                message,
                data: data,
            };
        throw new common_1.BadRequestException(code_1.ANOTHER_ERROR_RESPONE);
    }
    async getDepartmentByDepartmentName(departmentName) {
        const { statusCode, message, data } = await this.departmentService.getDepartmentByDeparmentName(departmentName);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException({
                statusCode,
                message,
            });
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async updateDepartment(departmentID, updateDepartmentDto) {
        const { statusCode, message, data } = await this.departmentService.updateDepartment(departmentID, updateDepartmentDto);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        throw new common_1.BadRequestException(statusCode, message);
    }
    async deleteDepartment(departmentID) {
        const { statusCode, message } = await this.departmentService.deleteDepartment(departmentID);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        throw new common_1.BadRequestException(statusCode, message);
    }
};
exports.DepartmentController = DepartmentController;
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Get all user successfull',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "user isn't an admin",
    }),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/byID/:departmentID'),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or manger of department',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: `Get department have id = ?? successfully`,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The department have id = ?? is not exist',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin', 'managerOfDepartment'),
    __param(0, (0, common_1.Param)('departmentID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "getDepartmentById", null);
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Create department successfully',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'The name of department is existed',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'The id of manager is not exist',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createDepartment_dto_1.default]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Get)('byDepartmentName/:departmentName'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get department by departmentName for admin',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Get department by departmentName is successfull !!',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The department have name = ?? is not exist',
    }),
    __param(0, (0, common_1.Param)('departmentName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "getDepartmentByDepartmentName", null);
__decorate([
    (0, common_1.Patch)(':departmentID'),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or manger of department',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBadRequestResponse)({}),
    (0, swagger_1.ApiBadRequestResponse)({}),
    (0, swagger_1.ApiConflictResponse)({}),
    __param(0, (0, common_1.Param)('departmentID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_department_dto_1.default]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)(':departmentID'),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or manger of department',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBadRequestResponse)({}),
    (0, swagger_1.ApiBadRequestResponse)({}),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __param(0, (0, common_1.Param)('departmentID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "deleteDepartment", null);
exports.DepartmentController = DepartmentController = __decorate([
    (0, common_1.Controller)('department'),
    __metadata("design:paramtypes", [department_service_1.DepartmentService,
        user_service_1.UserService])
], DepartmentController);
//# sourceMappingURL=department.controller.js.map