"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const attendance_module_module_1 = require("./attendance-module/attendance-module.module");
const auth_module_1 = require("./auth/auth.module");
const bycypt_hashed_module_1 = require("./common/bycypt-hashed/bycypt-hashed.module");
const seed_service_1 = require("./common/seed.service");
const system_log_cleanup_service_1 = require("./common/system-log-cleanup.service");
const department_module_1 = require("./department/department.module");
const leave_application_module_1 = require("./leave-application/leave-application.module");
const monthly_time_sheet_module_1 = require("./monthly-time-sheet/monthly-time-sheet.module");
const notification_module_1 = require("./notification/notification.module");
const payroll_module_1 = require("./payroll/payroll.module");
const prisma_module_1 = require("./prisma/prisma.module");
const role_module_1 = require("./role/role.module");
const type_leave_module_1 = require("./type-leave/type-leave.module");
const user_module_1 = require("./user/user.module");
const warning_module_1 = require("./warning/warning.module");
const request_correction_module_1 = require("./request-correction/request-correction.module");
const email_module_1 = require("./common/email.module");
const realtime_module_1 = require("./realtime/realtime.module");
const cloudinary_module_1 = require("./common/cloudinary/cloudinary.module");
const system_log_module_1 = require("./system-log/system-log.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: ['.env', '../.env'],
            }),
            prisma_module_1.PrismaModule,
            role_module_1.RoleModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            department_module_1.DepartmentModule,
            bycypt_hashed_module_1.BycyptHashedModule,
            attendance_module_module_1.AttendanceModuleModule,
            monthly_time_sheet_module_1.MonthlyTimeSheetModule,
            notification_module_1.NotificationModule,
            schedule_1.ScheduleModule.forRoot(),
            warning_module_1.WarningModule,
            type_leave_module_1.TypeLeaveModule,
            leave_application_module_1.LeaveApplicationModule,
            payroll_module_1.PayrollModule,
            request_correction_module_1.RequestCorrectionModule,
            email_module_1.EmailModule,
            realtime_module_1.RealtimeModule,
            cloudinary_module_1.CloudinaryModule,
            system_log_module_1.SystemLogModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, seed_service_1.SeedService, system_log_cleanup_service_1.SystemLogCleanupService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map