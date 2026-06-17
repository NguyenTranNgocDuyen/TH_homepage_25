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
exports.MonthlyTimeSheetController = void 0;
const common_1 = require("@nestjs/common");
const monthly_time_sheet_service_1 = require("./monthly-time-sheet.service");
const get_timesheet_dto_1 = __importDefault(require("./dto/get-timesheet.dto"));
const report_timesheet_dto_1 = __importDefault(require("./dto/report-timesheet.dto"));
const excel_helper_1 = require("../common/excel.helper");
const code_1 = require("../common/code");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_guard_1 = require("../auth/guards/access.guard");
const require_permissions_decorator_1 = require("../common/require-permissions.decorator");
const create_timesheet_dto_1 = __importDefault(require("./dto/create-timesheet.dto"));
const reviwer_guard_1 = __importDefault(require("../auth/guards/reviwer.guard"));
const review_monthly_timesheet_dto_1 = __importDefault(require("./dto/review-monthly-timesheet.dto"));
let MonthlyTimeSheetController = class MonthlyTimeSheetController {
    timeSheetService;
    constructor(timeSheetService) {
        this.timeSheetService = timeSheetService;
    }
    async getMonthlyTimesheet(userID, getTimesheetDto) {
        const { statusCode, message, data } = await this.timeSheetService.getMonthlyTimeSheet(userID, getTimesheetDto);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
    async getMonthlyTimesheetsForReview(getTimesheetDto, req) {
        const { statusCode, message, data } = await this.timeSheetService.getMonthlyTimesheetsForReview(getTimesheetDto.month, getTimesheetDto.year, req.user?.userID);
        if (statusCode === code_1.OK_CODE) {
            return {
                statusCode,
                message,
                data,
            };
        }
        throw new common_1.BadRequestException(statusCode, message);
    }
    async getTimesheetReport(reportQuery, req) {
        const data = await this.timeSheetService.getTimesheetReport(reportQuery, req.user);
        return {
            statusCode: code_1.OK_CODE,
            message: 'get timesheet report successfull',
            data,
        };
    }
    async exportPersonalTimesheetCSV(userID, month, year, format = 'csv', res) {
        const monthNumber = Number(month);
        const yearNumber = Number(year);
        if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
            throw new common_1.BadRequestException('Invalid month or year');
        }
        const csvString = await this.timeSheetService.exportPersonalTimesheetCsv(userID, monthNumber, yearNumber, format);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="timesheet_${userID}_${monthNumber}_${yearNumber}.csv"`);
        res.send(csvString);
    }
    async exportPersonalTimesheetExcel(userID, month, year, res) {
        const monthNumber = Number(month);
        const yearNumber = Number(year);
        if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
            throw new common_1.BadRequestException('Invalid month or year');
        }
        const workbook = await this.timeSheetService.exportPersonalTimesheetExcel(userID, monthNumber, yearNumber);
        await excel_helper_1.ExcelHelper.sendExcel(res, workbook, `timesheet_${userID}_${monthNumber}_${yearNumber}`);
    }
    async exportDepartmentTimesheetCSV(departmentID, month, year, res) {
        const monthNumber = Number(month);
        const yearNumber = Number(year);
        if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
            throw new common_1.BadRequestException('Invalid month or year');
        }
        const csvString = await this.timeSheetService.exportDepartmentTimesheetCsv(departmentID, monthNumber, yearNumber);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="timesheet_department_${departmentID}_${monthNumber}_${yearNumber}.csv"`);
        res.send(csvString);
    }
    async exportDepartmentTimesheetExcel(departmentID, month, year, res) {
        const monthNumber = Number(month);
        const yearNumber = Number(year);
        if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
            throw new common_1.BadRequestException('Invalid month or year');
        }
        const workbook = await this.timeSheetService.exportDepartmentTimesheetExcel(departmentID, monthNumber, yearNumber);
        await excel_helper_1.ExcelHelper.sendExcel(res, workbook, `timesheet_department_${departmentID}_${monthNumber}_${yearNumber}`);
    }
    async createMonthlyTimesheet(userID, createMonthlyTimessheet) {
        const { statusCode, message, data } = await this.timeSheetService.createMonthlyTimeSheet(userID, createMonthlyTimessheet);
        if (statusCode === code_1.CREATED_RESPONE)
            return {
                statusCode,
                message,
                data,
            };
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
    async SubmitMonthlyTimesheet(monthlyTImesheetID) {
        const { statusCode, message, data } = await this.timeSheetService.SubmitMonthlyTimesheet(monthlyTImesheetID);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
    async reviewMonthlyTimsheet(monthlyTimesheetID, reviewMonthlyTimesheetDto, req) {
        const { statusCode, message, data } = await this.timeSheetService.reviewMonthlyTimesheet(monthlyTimesheetID, reviewMonthlyTimesheetDto, req.user?.userID);
        if (statusCode === code_1.OK_CODE)
            return {
                statusCode,
                message,
                data,
            };
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(message);
        throw new common_1.BadRequestException(message);
    }
};
exports.MonthlyTimeSheetController = MonthlyTimeSheetController;
__decorate([
    (0, common_1.Get)('/monthlyTimesheet/:userID'),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get monthly timesheet (Role: me, manager of employee, admin)',
    }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_timesheet_dto_1.default]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "getMonthlyTimesheet", null);
__decorate([
    (0, common_1.Get)('/review-list'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Submitted monthly timesheets for manager review',
    }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get submitted monthly timesheets in current manager scope',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_timesheet_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "getMonthlyTimesheetsForReview", null);
__decorate([
    (0, common_1.Get)('/report'),
    (0, swagger_1.ApiOkResponse)({ description: 'Timesheet report with filters and summary' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get timesheet report by date range, employee, department and status',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_timesheet_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "getTimesheetReport", null);
__decorate([
    (0, common_1.Get)('/export/:userID'),
    (0, swagger_1.ApiOkResponse)({ description: 'Export personal timesheet as CSV' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Export personal timesheet CSV (Role: me)' }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "exportPersonalTimesheetCSV", null);
__decorate([
    (0, common_1.Get)('/export-excel/:userID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Export personal timesheet Excel (Role: me)' }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "exportPersonalTimesheetExcel", null);
__decorate([
    (0, common_1.Get)('/export-department/:departmentID'),
    (0, swagger_1.ApiOkResponse)({ description: 'Export department timesheet as CSV' }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('managerOfDepartment', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export department timesheet CSV (Role: manager, admin)',
    }),
    __param(0, (0, common_1.Param)('departmentID')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "exportDepartmentTimesheetCSV", null);
__decorate([
    (0, common_1.Get)('/export-department-excel/:departmentID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('managerOfDepartment', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Export department timesheet Excel' }),
    __param(0, (0, common_1.Param)('departmentID')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "exportDepartmentTimesheetExcel", null);
__decorate([
    (0, common_1.Post)('/monthlyTimesheet/:userID'),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, access_guard_1.UserAccessGaurd),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    (0, swagger_1.ApiOperation)({
        summary: "while test login with 'me' role, not use in production",
    }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_timesheet_dto_1.default]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "createMonthlyTimesheet", null);
__decorate([
    (0, common_1.Patch)('/submitMonthlyTimesheet/:monthlyTimesheetID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, reviwer_guard_1.default),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, require_permissions_decorator_1.RequirePermission)('me'),
    __param(0, (0, common_1.Param)('monthlyTimesheetID', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "SubmitMonthlyTimesheet", null);
__decorate([
    (0, common_1.Patch)('reviewMonthlyTimesheet/:monthlyTimesheetID'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, reviwer_guard_1.default),
    (0, require_permissions_decorator_1.RequirePermission)('manager'),
    __param(0, (0, common_1.Param)('monthlyTimesheetID')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_monthly_timesheet_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], MonthlyTimeSheetController.prototype, "reviewMonthlyTimsheet", null);
exports.MonthlyTimeSheetController = MonthlyTimeSheetController = __decorate([
    (0, common_1.Controller)('time-sheet'),
    __metadata("design:paramtypes", [monthly_time_sheet_service_1.MonthlyTimeSheetService])
], MonthlyTimeSheetController);
//# sourceMappingURL=monthly-time-sheet.controller.js.map