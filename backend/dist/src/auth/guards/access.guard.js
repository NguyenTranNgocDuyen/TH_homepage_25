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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessGaurd = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const code_1 = require("../../common/code");
const user_service_1 = require("../../user/user.service");
let UserAccessGaurd = class UserAccessGaurd {
    userService;
    reflector;
    constructor(userService, reflector) {
        this.userService = userService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const allowedPermissions = this.reflector.getAllAndOverride('permission', [context.getHandler(), context.getClass()]);
        if (!allowedPermissions?.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const currentUser = request.user;
        const { userID, email, username, departmentID } = request.params;
        const { input, type } = this.resolveTarget({
            userID,
            email,
            username,
            departmentID,
        });
        for (const permission of allowedPermissions) {
            if (permission === 'admin' &&
                (await this.userService.checkAuthIsAdmin(currentUser)).statusCode ===
                    code_1.OK_CODE) {
                return true;
            }
            if (permission === 'me' &&
                (!input ||
                    this.userService.IsMe(currentUser, input, type).statusCode ===
                        code_1.OK_CODE)) {
                return true;
            }
            if (permission === 'manager') {
                const managerCheck = input && type !== 'departmentID'
                    ? await this.userService.checkAuthIsMyManager(currentUser, input, type)
                    : await this.userService.checkIsManager(currentUser?.userID);
                if (managerCheck.statusCode === code_1.OK_CODE) {
                    return true;
                }
            }
            if (permission === 'managerOfDepartment' &&
                (await this.userService.checkAuthIsManagerOfDepartment(currentUser, input)).statusCode === code_1.OK_CODE) {
                return true;
            }
        }
        throw new common_1.ForbiddenException("You don't have permission to access this resource.");
    }
    resolveTarget(params) {
        if (params.userID) {
            return { input: params.userID, type: 'userID' };
        }
        if (params.email) {
            return { input: params.email, type: 'email' };
        }
        if (params.username) {
            return { input: params.username, type: 'username' };
        }
        if (params.departmentID) {
            return { input: params.departmentID, type: 'departmentID' };
        }
        return { input: '', type: '' };
    }
};
exports.UserAccessGaurd = UserAccessGaurd;
exports.UserAccessGaurd = UserAccessGaurd = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        core_1.Reflector])
], UserAccessGaurd);
//# sourceMappingURL=access.guard.js.map