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
exports.AttendanceModuleController = void 0;
const common_1 = require("@nestjs/common");
const attendance_module_service_1 = require("./attendance-module.service");
const code_1 = require("../common/code");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const getAttendence_dto_1 = __importDefault(require("./dto/getAttendence.dto"));
const checkIn_dto_1 = __importDefault(require("./dto/checkIn.dto"));
const checkOut_dto_1 = __importDefault(require("./dto/checkOut.dto"));
const common_2 = require("@nestjs/common");
let AttendanceModuleController = class AttendanceModuleController {
    attendanceModuleService;
    constructor(attendanceModuleService) {
        this.attendanceModuleService = attendanceModuleService;
    }
    async checkIn(userID, checkInDto, req) {
        const forwarded = req.headers['x-forwarded-for'];
        let ip = undefined;
        if (forwarded) {
            ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0];
        }
        else {
            ip = req.socket.remoteAddress;
        }
        const deviceInfo = checkInDto.deviceInfo || req.headers['user-agent'];
        const { statusCode, message } = await this.attendanceModuleService.checkIn(userID, ip, deviceInfo);
        if (statusCode === code_1.CREATED_RESPONE || statusCode === code_1.OK_CODE)
            return { statusCode, message };
        if (statusCode == code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
    async checkOut(userID, checkOutDto, req) {
        const forwarded = req.headers['x-forwarded-for'];
        let ip = undefined;
        if (forwarded) {
            ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0];
        }
        else {
            ip = req.socket.remoteAddress;
        }
        const deviceInfo = checkOutDto.deviceInfo || req.headers['user-agent'];
        const { statusCode, message } = await this.attendanceModuleService.checkOut(userID, ip, deviceInfo);
        if (statusCode === code_1.CREATED_RESPONE || statusCode === code_1.OK_CODE)
            return { statusCode, message };
        if (statusCode == code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
    async getAllEntryOfMonth(userID, getAttendence) {
        const { statusCode, message, data } = await this.attendanceModuleService.getAllAttedencOfMonth(userID, getAttendence);
        if (statusCode === code_1.OK_CODE)
            return { statusCode, message, data };
        if (statusCode == code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
    async GetAllEmployeeDindNotCheckOutOfDay() {
        const now = new Date();
        const { statusCode, message, data } = await this.attendanceModuleService.GetAllEmployeeDidNotCheckOutBefore(now.toISOString().split('T')[0]);
        if (statusCode === code_1.OK_CODE)
            return { statusCode, message, data };
        if (statusCode == code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
};
exports.AttendanceModuleController = AttendanceModuleController;
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({
        description: 'for me',
    }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, common_1.Post)('/checkIn/:userID'),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, checkIn_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], AttendanceModuleController.prototype, "checkIn", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({
        description: 'for me',
    }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, common_1.Post)('/checkOut/:userID'),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, checkOut_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], AttendanceModuleController.prototype, "checkOut", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({
        description: 'for me',
    }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, common_1.Get)('/getAllAttendenceOfMonth/:userID'),
    (0, require_permissions_decorator_1.RequirePermission)('me', 'manager', 'admin'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, getAttendence_dto_1.default]),
    __metadata("design:returntype", Promise)
], AttendanceModuleController.prototype, "getAllEntryOfMonth", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiOperation)({
        description: 'for me',
    }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, common_1.Get)('/AllEmployeeNotCheckOutOfToday'),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceModuleController.prototype, "GetAllEmployeeDindNotCheckOutOfDay", null);
exports.AttendanceModuleController = AttendanceModuleController = __decorate([
    (0, common_1.Controller)('attendance-module'),
    __metadata("design:paramtypes", [attendance_module_service_1.AttendanceModuleService])
], AttendanceModuleController);
//# sourceMappingURL=attendance-module.controller.js.map