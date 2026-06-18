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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payroll_service_1 = require("./payroll.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const get_payroll_query_dto_1 = require("./dto/get-payroll-query.dto");
const export_payroll_query_dto_1 = require("./dto/export-payroll-query.dto");
const code_1 = require("../common/code");
const excel_helper_1 = require("../common/excel.helper");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async generatePayroll(monthlyTimesheetID) {
        const response = await this.payrollService.generatePayroll(monthlyTimesheetID);
        if (response.statusCode === code_1.CREATED_RESPONE ||
            response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        if (response.statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getMyPayroll(userID, query) {
        const response = await this.payrollService.getMyPayroll(userID, query.month, query.year);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async getDepartmentPayroll(departmentID, query) {
        const response = await this.payrollService.getDepartmentPayroll(departmentID, query.month, query.year);
        if (response.statusCode === code_1.OK_CODE)
            return response;
        if (response.statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(response.statusCode, response.message);
        throw new common_1.BadRequestException(response.statusCode, response.message);
    }
    async exportPayroll(query, res) {
        const result = await this.payrollService.exportPayroll(query.month, query.year, query.format);
        if (result.statusCode !== code_1.OK_CODE) {
            throw new common_1.BadRequestException(result.message);
        }
        if (result.isCsv) {
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="payroll_report_${query.month || 'all'}_${query.year || 'all'}.csv"`,
            });
            if (result.warnings?.length) {
                res.set('X-Export-Warning', result.warnings.join(' | '));
            }
            res.send(result.data);
            return;
        }
        res.json(result);
    }
    async exportPayrollExcel(query, res) {
        try {
            const workbook = await this.payrollService.exportPayrollExcel(query.month, query.year);
            await excel_helper_1.ExcelHelper.sendExcel(res, workbook, `payroll_report_${query.month || 'all'}_${query.year || 'all'}`);
        }
        catch (error) {
            throw new common_1.BadRequestException(error instanceof Error ? error.message : 'Invalid payroll export query');
        }
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Tạo bảng lương từ timesheet đã duyệt (Role: admin)',
    }),
    (0, swagger_1.ApiCreatedResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Post)('/generate/:monthlyTimesheetID'),
    __param(0, (0, common_1.Param)('monthlyTimesheetID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "generatePayroll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Xem bảng lương cá nhân (Role: me)' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, common_1.Get)('/user/:userID'),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_payroll_query_dto_1.GetPayrollQueryDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayroll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Xem bảng lương theo phòng ban (Role: manager, admin)',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('managerOfDepartment', 'admin'),
    (0, common_1.Get)('/department/:departmentID'),
    __param(0, (0, common_1.Param)('departmentID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_payroll_query_dto_1.GetPayrollQueryDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getDepartmentPayroll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Xuất báo cáo lương (Role: admin)' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Get)('/export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_payroll_query_dto_1.ExportPayrollQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "exportPayroll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: 'Xuất báo cáo lương Excel (Role: admin)' }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('admin'),
    (0, common_1.Get)('/export-excel'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_payroll_query_dto_1.ExportPayrollQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "exportPayrollExcel", null);
exports.PayrollController = PayrollController = __decorate([
    (0, swagger_1.ApiTags)('payroll'),
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map