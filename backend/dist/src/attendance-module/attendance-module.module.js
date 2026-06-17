"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModuleModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_module_service_1 = require("./attendance-module.service");
const attendance_module_controller_1 = require("./attendance-module.controller");
const user_module_1 = require("../user/user.module");
const monthly_time_sheet_module_1 = require("../monthly-time-sheet/monthly-time-sheet.module");
const notification_module_1 = require("../notification/notification.module");
const missedCheckout_1 = require("./missedCheckout");
const warning_module_1 = require("../warning/warning.module");
let AttendanceModuleModule = class AttendanceModuleModule {
};
exports.AttendanceModuleModule = AttendanceModuleModule;
exports.AttendanceModuleModule = AttendanceModuleModule = __decorate([
    (0, common_1.Module)({
        controllers: [attendance_module_controller_1.AttendanceModuleController],
        providers: [attendance_module_service_1.AttendanceModuleService, missedCheckout_1.MissedCheckoutTask],
        imports: [
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => monthly_time_sheet_module_1.MonthlyTimeSheetModule),
            notification_module_1.NotificationModule,
            (0, common_1.forwardRef)(() => warning_module_1.WarningModule),
        ],
        exports: [attendance_module_service_1.AttendanceModuleService],
    })
], AttendanceModuleModule);
//# sourceMappingURL=attendance-module.module.js.map