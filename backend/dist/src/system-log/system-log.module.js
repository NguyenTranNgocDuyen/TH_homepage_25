"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogModule = void 0;
const common_1 = require("@nestjs/common");
const system_log_service_1 = require("./system-log.service");
const system_log_controller_1 = require("./system-log.controller");
const user_module_1 = require("../user/user.module");
let SystemLogModule = class SystemLogModule {
};
exports.SystemLogModule = SystemLogModule;
exports.SystemLogModule = SystemLogModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule],
        providers: [system_log_service_1.SystemLogService],
        controllers: [system_log_controller_1.SystemLogController],
    })
], SystemLogModule);
//# sourceMappingURL=system-log.module.js.map