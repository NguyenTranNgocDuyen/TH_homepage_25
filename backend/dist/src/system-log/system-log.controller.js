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
exports.SystemLogController = void 0;
const common_1 = require("@nestjs/common");
const system_log_service_1 = require("./system-log.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const swagger_1 = require("@nestjs/swagger");
let SystemLogController = class SystemLogController {
    systemLogService;
    constructor(systemLogService) {
        this.systemLogService = systemLogService;
    }
    async getAllLogs(limit, skip, startDate, endDate) {
        return this.systemLogService.getAllLogs(limit, skip, startDate, endDate);
    }
    async toggleAnomaly(id) {
        return this.systemLogService.toggleAnomaly(id);
    }
};
exports.SystemLogController = SystemLogController;
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all system logs (Admin only)' }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(200), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('skip', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SystemLogController.prototype, "getAllLogs", null);
__decorate([
    (0, common_1.Patch)('toggle-anomaly/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle anomalous status of a system log' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemLogController.prototype, "toggleAnomaly", null);
exports.SystemLogController = SystemLogController = __decorate([
    (0, swagger_1.ApiTags)('system-log'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('system-log'),
    __metadata("design:paramtypes", [system_log_service_1.SystemLogService])
], SystemLogController);
//# sourceMappingURL=system-log.controller.js.map