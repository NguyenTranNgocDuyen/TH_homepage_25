"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarningModule = void 0;
const common_1 = require("@nestjs/common");
const warning_service_1 = require("./warning.service");
const warning_controller_1 = require("./warning.controller");
const user_module_1 = require("../user/user.module");
const attendance_module_module_1 = require("../attendance-module/attendance-module.module");
const notification_module_1 = require("../notification/notification.module");
let WarningModule = class WarningModule {
};
exports.WarningModule = WarningModule;
exports.WarningModule = WarningModule = __decorate([
    (0, common_1.Module)({
        controllers: [warning_controller_1.WarningController],
        providers: [warning_service_1.WarningService],
        imports: [
            user_module_1.UserModule,
            (0, common_1.forwardRef)(() => attendance_module_module_1.AttendanceModuleModule),
            notification_module_1.NotificationModule,
        ],
        exports: [warning_service_1.WarningService],
    })
], WarningModule);
//# sourceMappingURL=warning.module.js.map