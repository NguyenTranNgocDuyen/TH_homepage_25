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
exports.EmployeeImportController = exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./dto/create-user.dto");
const code_1 = require("../common/code");
const update_user_dto_1 = __importDefault(require("./dto/update-user.dto"));
const self_update_user_dto_1 = require("./dto/self-update-user.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUser() {
        const { statusCode, message, data } = await this.userService.getAllUser();
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async getUserByID(userID) {
        const { statusCode, message, data } = await this.userService.getUserByUserID(userID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async getUserByUsername(useranme) {
        const { statusCode, message, data } = await this.userService.getUserByUserName(useranme);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async getUserByEmail(email) {
        const { statusCode, message, data } = await this.userService.getUserByEmail(email);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async getUserAllUserByDepartmentID(departmentID) {
        const { statusCode, message, data } = await this.userService.getAllUserOfDepartment(departmentID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        return code_1.ANOTHER_ERROR_RESPONE;
    }
    async createUser(createUserDto) {
        const response = await this.userService.createUser(createUserDto);
        const { statusCode, message, data } = response;
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.CREATED_RESPONE)
            return { statusCode, message, data };
        throw new common_1.BadRequestException(code_1.ANOTHER_ERROR_RESPONE);
    }
    async updateMe(req, selfUpdateDto) {
        const userID = req.user?.userID;
        if (!userID) {
            throw new common_1.BadRequestException('User information not found in request');
        }
        const { statusCode, message, data } = await this.userService.updateSelfProfile(userID, selfUpdateDto);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(statusCode, message);
    }
    async uploadAvatar(req, file) {
        const userID = req.user?.userID;
        if (!userID) {
            throw new common_1.BadRequestException('User information not found in request');
        }
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const { statusCode, message, data } = await this.userService.uploadAvatar(userID, file);
        if (statusCode === code_1.OK_CODE) {
            return { statusCode, message, data };
        }
        throw new common_1.BadRequestException(message);
    }
    async updateUser(id, updateUserDto) {
        const { statusCode, message, data } = await this.userService.updateUser(id, updateUserDto);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(code_1.ANOTHER_ERROR_RESPONE);
    }
    async deactivateUser(userID, req) {
        if (req.user.userID === userID) {
            throw new common_1.BadRequestException('Cannot deactivate your own account');
        }
        const { statusCode, message, data } = await this.userService.deactivateUser(userID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(statusCode, message);
    }
    async activateUser(userID) {
        const { statusCode, message, data } = await this.userService.activateUser(userID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(statusCode, message);
    }
    async deleteUser(userID, req) {
        if (req.user.userID === userID) {
            throw new common_1.BadRequestException('Cannot delete your own account');
        }
        const { statusCode, message } = await this.userService.deleteUser(userID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        throw new common_1.BadRequestException(statusCode, message);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'get all users successfull',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, common_1.Get)('/'),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUser", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'get user successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The user have userid is not found',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or my manger or me',
    }),
    (0, require_permissions_decorator_1.RequirePermission)('admin', 'manager', 'me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, common_1.Get)('/getByID/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByID", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or my manger or me',
    }),
    (0, common_1.Get)('/getByUsername/:username'),
    (0, swagger_1.ApiOkResponse)({
        description: 'get user successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The user have username is not found',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, require_permissions_decorator_1.RequirePermission)('admin', 'manager', 'me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByUsername", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or my manger or me',
    }),
    (0, common_1.Get)('/getByEmail/:email'),
    (0, swagger_1.ApiOkResponse)({
        description: 'get user successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The user have email is not found',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin', 'manager', 'me'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or manager of department',
    }),
    (0, common_1.Get)('/getByDepartment/:departmentID'),
    (0, swagger_1.ApiOkResponse)({
        description: 'get user successfull',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'The user have email is not found',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin', 'managerOfDepartment'),
    __param(0, (0, common_1.Param)('departmentID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserAllUserByDepartmentID", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, swagger_1.ApiOkResponse)({ description: 'create user successfull !!!' }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Conflict',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Not found',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for current authenticated user',
        description: 'Allows a user to update only personal profile fields: avatar, phone, address, emergency contact, birthday.',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('/me'),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, self_update_user_dto_1.SelfUpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Upload avatar for current authenticated user',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin or my manger or me',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':userID'),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.default]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('/deactivate/:userID'),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deactivateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('/activate/:userID'),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'HARD DELETE user - FOR TECHNICAL ADMIN ONLY',
        description: 'Warning: This permanently deletes user data. Use /deactivate/:userID for normal offboarding.',
        deprecated: true,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':userID'),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
let EmployeeImportController = class EmployeeImportController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async importEmployees(file) {
        const result = await this.userService.importEmployeesFromExcel(file);
        if (result.errors.length > 0 && result.importedCount === 0) {
            throw new common_1.BadRequestException({
                message: 'Import Excel that bai. Vui long kiem tra cac dong loi.',
                errors: result.errors,
                successes: [],
            });
        }
        return {
            statusCode: code_1.OK_CODE,
            message: result.errors.length > 0
                ? `Da import ${result.importedCount} nhan vien, mot so dong bi loi.`
                : `Da import thanh cong ${result.importedCount} nhan vien.`,
            data: result,
        };
    }
};
exports.EmployeeImportController = EmployeeImportController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Import employees from Excel for admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/import'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeImportController.prototype, "importEmployees", null);
exports.EmployeeImportController = EmployeeImportController = __decorate([
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], EmployeeImportController);
//# sourceMappingURL=user.controller.js.map