"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BycyptHashedModule = void 0;
const common_1 = require("@nestjs/common");
const bycypt_hashed_service_1 = require("./bycypt-hashed.service");
const bycypt_hashed_controller_1 = require("./bycypt-hashed.controller");
let BycyptHashedModule = class BycyptHashedModule {
};
exports.BycyptHashedModule = BycyptHashedModule;
exports.BycyptHashedModule = BycyptHashedModule = __decorate([
    (0, common_1.Module)({
        controllers: [bycypt_hashed_controller_1.BycyptHashedController],
        providers: [bycypt_hashed_service_1.BycyptHashedService],
        exports: [bycypt_hashed_service_1.BycyptHashedService],
    })
], BycyptHashedModule);
//# sourceMappingURL=bycypt-hashed.module.js.map