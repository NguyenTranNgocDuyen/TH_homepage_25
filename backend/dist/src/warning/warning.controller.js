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
exports.WarningController = void 0;
const common_1 = require("@nestjs/common");
const warning_service_1 = require("./warning.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const create_warning_dto_1 = require("./dto/create-warning.dto");
const code_1 = require("../common/code");
let WarningController = class WarningController {
    warningService;
    constructor(warningService) {
        this.warningService = warningService;
    }
    async seandWarning(createWarningDto) {
        const { statusCode, message, data } = await this.warningService.sendWarning(createWarningDto);
        if (statusCode === code_1.CREATED_RESPONE)
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
};
exports.WarningController = WarningController;
__decorate([
    (0, common_1.Post)('/sendWarning'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send an employee warning as an admin',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_warning_dto_1.CreateWarningDto]),
    __metadata("design:returntype", Promise)
], WarningController.prototype, "seandWarning", null);
exports.WarningController = WarningController = __decorate([
    (0, common_1.Controller)('warning'),
    __metadata("design:paramtypes", [warning_service_1.WarningService])
], WarningController);
//# sourceMappingURL=warning.controller.js.map