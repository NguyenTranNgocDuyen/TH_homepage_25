"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const leave_application_controller_1 = require("./leave-application.controller");
const leave_application_service_1 = require("./leave-application.service");
const leave_cron_service_1 = require("./leave-cron.service");
const prisma_module_1 = require("../prisma/prisma.module");
const user_module_1 = require("../user/user.module");
const notification_module_1 = require("../notification/notification.module");
const expired_leave_application_service_1 = require("./expired-leave-application.service");
let LeaveApplicationModule = class LeaveApplicationModule {
};
exports.LeaveApplicationModule = LeaveApplicationModule;
exports.LeaveApplicationModule = LeaveApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, user_module_1.UserModule, notification_module_1.NotificationModule],
        controllers: [leave_application_controller_1.LeaveApplicationController],
        providers: [
            leave_application_service_1.LeaveApplicationService,
            leave_cron_service_1.LeaveCronService,
            expired_leave_application_service_1.ExpiredLeaveApplicationService,
        ],
        exports: [leave_application_service_1.LeaveApplicationService],
    })
], LeaveApplicationModule);
//# sourceMappingURL=leave-application.module.js.map