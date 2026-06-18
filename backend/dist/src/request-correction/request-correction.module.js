"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCorrectionModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("../user/user.module");
const notification_module_1 = require("../notification/notification.module");
const email_module_1 = require("../common/email.module");
const request_correction_controller_1 = require("./request-correction.controller");
const request_correction_service_1 = require("./request-correction.service");
let RequestCorrectionModule = class RequestCorrectionModule {
};
exports.RequestCorrectionModule = RequestCorrectionModule;
exports.RequestCorrectionModule = RequestCorrectionModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, notification_module_1.NotificationModule, email_module_1.EmailModule],
        controllers: [request_correction_controller_1.RequestCorrectionController],
        providers: [request_correction_service_1.RequestCorrectionService],
        exports: [request_correction_service_1.RequestCorrectionService],
    })
], RequestCorrectionModule);
//# sourceMappingURL=request-correction.module.js.map