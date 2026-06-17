"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyTimeSheetModule = void 0;
const common_1 = require("@nestjs/common");
const monthly_time_sheet_service_1 = require("./monthly-time-sheet.service");
const monthly_time_sheet_controller_1 = require("./monthly-time-sheet.controller");
const user_module_1 = require("../user/user.module");
const department_module_1 = require("../department/department.module");
const notification_module_1 = require("../notification/notification.module");
let MonthlyTimeSheetModule = class MonthlyTimeSheetModule {
};
exports.MonthlyTimeSheetModule = MonthlyTimeSheetModule;
exports.MonthlyTimeSheetModule = MonthlyTimeSheetModule = __decorate([
    (0, common_1.Module)({
        controllers: [monthly_time_sheet_controller_1.MonthlyTimeSheetController],
        providers: [monthly_time_sheet_service_1.MonthlyTimeSheetService],
        exports: [monthly_time_sheet_service_1.MonthlyTimeSheetService],
        imports: [
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => department_module_1.DepartmentModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
        ],
    })
], MonthlyTimeSheetModule);
//# sourceMappingURL=monthly-time-sheet.module.js.map