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
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const code_1 = require("../../common/code");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_service_1 = require("../../user/user.service");
function isManagerData(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'managerID' in value &&
        typeof value.managerID === 'string');
}
let ReviewAuthGuards = class ReviewAuthGuards {
    reflector;
    prismaService;
    userService;
    constructor(reflector, prismaService, userService) {
        this.reflector = reflector;
        this.prismaService = prismaService;
        this.userService = userService;
    }
    async canActivate(context) {
        const allowedPermission = this.reflector.get('permission', context.getHandler());
        if (!allowedPermission)
            return true;
        const request = context.switchToHttp().getRequest();
        const currentUser = request.user;
        const { monthlyTimesheetID } = request.params;
        if (monthlyTimesheetID === undefined)
            throw new common_1.UnauthorizedException('The monthlyTimesheetID cannot undefined');
        for (const permission of allowedPermission) {
            if (permission === 'manager') {
                const monthlyTimesheet = await this.prismaService.monthlyTimesheet.findFirst({
                    where: {
                        monthlyTimesheetID,
                    },
                });
                if (monthlyTimesheet === null)
                    throw new common_1.NotFoundException('monthlyTimesheetID is not found');
                if (monthlyTimesheet.isSubmitted === false)
                    throw new common_1.BadRequestException('This monthly timesheet was not submitted');
                const managerGet = await this.userService.getManagerIdOfUserID(monthlyTimesheet.userID);
                if (managerGet.statusCode !== code_1.OK_CODE || !managerGet.data) {
                    throw new common_1.BadRequestException(managerGet.message);
                }
                const managerData = managerGet.data;
                if (!isManagerData(managerData)) {
                    throw new common_1.BadRequestException(managerGet.message);
                }
                if (managerData.managerID === currentUser.userID)
                    return true;
            }
            else if (permission === 'me') {
                const monthlyTimesheet = await this.prismaService.monthlyTimesheet.findFirst({
                    where: {
                        monthlyTimesheetID,
                    },
                });
                if (monthlyTimesheet === null)
                    throw new common_1.NotFoundException('monthlyTimesheetID is not found');
                if (currentUser.userID === monthlyTimesheet.userID)
                    return true;
            }
        }
        throw new common_1.ForbiddenException("You don't have permission to access this user's data!");
    }
};
ReviewAuthGuards = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService,
        user_service_1.UserService])
], ReviewAuthGuards);
exports.default = ReviewAuthGuards;
//# sourceMappingURL=reviwer.guard.js.map