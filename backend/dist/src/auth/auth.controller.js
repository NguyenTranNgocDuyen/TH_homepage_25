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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const code_1 = require("../common/code");
const login_dto_1 = __importDefault(require("./dto/login.dto"));
const refreshToken_dto_1 = require("./dto/refreshToken.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const google_auth_guard_1 = require("./guards/google-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        const { statusCode, message, data } = await this.authService.login(loginDto);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode === code_1.CREATED_RESPONE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(statusCode, message);
    }
    async refreshToken(userID, token) {
        const { statusCode, message, data } = await this.authService.refreshToken(userID, token.refreshToken);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode === code_1.UNAUTHORIZED_CODE)
            throw new common_1.UnauthorizedException(statusCode, message);
        if (statusCode === code_1.CREATED_RESPONE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(code_1.ANOTHER_ERROR_RESPONE);
    }
    async logout(request) {
        const userID = request.user?.userID;
        if (!userID)
            throw new common_1.UnauthorizedException('User is not authenticated');
        const { statusCode, message, data } = await this.authService.logout(userID);
        if (statusCode === code_1.NOTFOUND_CODE)
            throw new common_1.NotFoundException(statusCode, message);
        if (statusCode === code_1.CONFLIG_CODE)
            throw new common_1.ConflictException(statusCode, message);
        if (statusCode === code_1.UNAUTHORIZED_CODE)
            throw new common_1.UnauthorizedException(statusCode, message);
        if (statusCode === code_1.CREATED_RESPONE)
            return {
                statusCode,
                message,
                data,
            };
        throw new common_1.BadRequestException(code_1.ANOTHER_ERROR_RESPONE);
    }
    googleAuth() {
    }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        if (!user?.email) {
            res.redirect(this.authService.buildSsoErrorRedirect('google', 'GOOGLE_SSO_FAILED', 'Google authentication failed'));
            return;
        }
        const result = await this.authService.googleLogin(user.email);
        if (result.statusCode !== code_1.CREATED_RESPONE || !result.data) {
            res.redirect(this.authService.buildSsoErrorRedirect('google', 'GOOGLE_SSO_UNAUTHORIZED', result.message));
            return;
        }
        res.redirect(this.authService.buildSsoSuccessRedirect('google', result.data));
    }
    microsoftAuth(res) {
        if (!this.authService.isMicrosoftConfigured()) {
            res.redirect(this.authService.buildSsoErrorRedirect('microsoft', 'MICROSOFT_SSO_NOT_CONFIGURED', 'Microsoft SSO is missing client id, tenant id, client secret, or callback URL.'));
            return;
        }
        const state = this.authService.createOAuthState('microsoft');
        res.redirect(this.authService.getMicrosoftAuthorizationUrl(state));
    }
    async microsoftAuthRedirect(code, state, error, errorDescription, res) {
        if (error) {
            res.redirect(this.authService.buildSsoErrorRedirect('microsoft', error, errorDescription || 'Microsoft authentication failed.'));
            return;
        }
        if (!code || !this.authService.verifyOAuthState(state, 'microsoft')) {
            res.redirect(this.authService.buildSsoErrorRedirect('microsoft', 'MICROSOFT_SSO_INVALID_CALLBACK', 'Microsoft callback is missing code or has an invalid state.'));
            return;
        }
        try {
            const result = await this.authService.microsoftLoginWithCode(code);
            if (result.statusCode !== code_1.CREATED_RESPONE || !result.data) {
                res.redirect(this.authService.buildSsoErrorRedirect('microsoft', 'MICROSOFT_SSO_UNAUTHORIZED', result.message));
                return;
            }
            res.redirect(this.authService.buildSsoSuccessRedirect('microsoft', result.data));
        }
        catch (callbackError) {
            res.redirect(this.authService.buildSsoErrorRedirect('microsoft', 'MICROSOFT_SSO_FAILED', callbackError instanceof Error
                ? callbackError.message
                : 'Microsoft authentication failed.'));
        }
    }
    async sendResetCode(sendCodeDto) {
        const result = await this.authService.sendResetCode(sendCodeDto.email);
        if (result.statusCode === code_1.NOTFOUND_CODE) {
            throw new common_1.NotFoundException(result.message);
        }
        if (result.statusCode !== code_1.OK_CODE &&
            result.statusCode !== code_1.CREATED_RESPONE) {
            throw new common_1.BadRequestException(result.message);
        }
        return result;
    }
    async verifyResetCode(verifyCodeDto) {
        const result = await this.authService.verifyResetCode(verifyCodeDto.email, verifyCodeDto.code);
        if (result.statusCode !== code_1.OK_CODE &&
            result.statusCode !== code_1.CREATED_RESPONE) {
            throw new common_1.BadRequestException(result.message);
        }
        return result;
    }
    async resetPassword(resetPasswordDto) {
        const result = await this.authService.resetPassword(resetPasswordDto.email, resetPasswordDto.code, resetPasswordDto.newPassword);
        if (result.statusCode !== code_1.OK_CODE &&
            result.statusCode !== code_1.CREATED_RESPONE) {
            throw new common_1.BadRequestException(result.message);
        }
        return result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/refreshToken/:userID'),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, swagger_1.ApiBadGatewayResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'for me',
    }),
    __param(0, (0, common_1.Param)('userID', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refreshToken_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'for me',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, swagger_1.ApiBadGatewayResponse)(),
    (0, swagger_1.ApiConflictResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Google SSO login' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Google SSO callback' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('microsoft'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Microsoft SSO login' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "microsoftAuth", null);
__decorate([
    (0, common_1.Get)('microsoft/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Microsoft SSO callback' }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Query)('error')),
    __param(3, (0, common_1.Query)('error_description')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "microsoftAuthRedirect", null);
__decorate([
    (0, common_1.Post)('forgot-password/send-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.SendCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendResetCode", null);
__decorate([
    (0, common_1.Post)('forgot-password/verify-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.VerifyCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetCode", null);
__decorate([
    (0, common_1.Post)('forgot-password/reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map