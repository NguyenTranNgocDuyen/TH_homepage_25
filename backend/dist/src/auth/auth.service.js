"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const code_1 = require("../common/code");
const jwt = __importStar(require("jsonwebtoken"));
const bycypt_hashed_service_1 = require("../common/bycypt-hashed/bycypt-hashed.service");
const env_1 = require("../common/env");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../common/email.service");
let AuthService = class AuthService {
    userService;
    bcryptHashedservice;
    prismaService;
    emailService;
    constructor(userService, bcryptHashedservice, prismaService, emailService) {
        this.userService = userService;
        this.bcryptHashedservice = bcryptHashedservice;
        this.prismaService = prismaService;
        this.emailService = emailService;
    }
    async login(loginDto) {
        const { email, username, password } = loginDto;
        const loginIdentifier = (email || username || '').trim();
        if (!loginIdentifier)
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Email or username is required',
            };
        let userResult = await this.userService.getUserByEmail(loginIdentifier);
        if (userResult.statusCode !== code_1.OK_CODE && username)
            userResult = await this.userService.getUserByUserName(loginIdentifier);
        const { statusCode, message, data } = userResult;
        if (statusCode !== code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        if (data !== undefined) {
            if (data?.isActive !== true)
                return {
                    statusCode: code_1.UNAUTHORIZED_CODE,
                    message: 'User account is inactive',
                };
            const hashed = data?.hashedPassword || '';
            if (!(await this.bcryptHashedservice.compare(password, hashed)))
                return {
                    statusCode: code_1.BADREQUEST_CODE,
                    message: 'The password is wrong',
                };
            const roleName = data?.role?.nameRole;
            const newAcessToken = this.genAccessToken(data?.username, data?.userID, data?.email, data?.roleId, data?.departmentID, roleName);
            const newRefreshToken = this.genRefreshToken(data?.userID || '', data?.username || '', data?.email || '');
            const userGet = await this.userService.updateUser(data?.userID || '', {
                refreshToken: newRefreshToken,
            });
            if (userGet.statusCode !== code_1.OK_CODE)
                return { statusCode, message };
            return {
                statusCode: code_1.CREATED_RESPONE,
                message: 'login successfull',
                data: {
                    accessToken: newAcessToken,
                    refreshToken: newRefreshToken,
                    user: this.toAuthUser(data),
                },
            };
        }
        return { statusCode: code_1.BADREQUEST_CODE, message: 'another error' };
    }
    async googleLogin(email) {
        return this.ssoLogin(email, 'Google');
    }
    isGoogleConfigured() {
        return (this.isConfiguredValue(env_1.ENV.GOOGLE.CLIENT_ID) &&
            this.isConfiguredValue(env_1.ENV.GOOGLE.CLIENT_SECRET) &&
            this.isConfiguredValue(env_1.ENV.GOOGLE.CALLBACK_URL));
    }
    isMicrosoftConfigured() {
        return (this.isConfiguredValue(env_1.ENV.MICROSOFT.CLIENT_ID) &&
            this.isConfiguredValue(env_1.ENV.MICROSOFT.CLIENT_SECRET) &&
            this.isConfiguredValue(env_1.ENV.MICROSOFT.TENANT_ID) &&
            this.isConfiguredValue(env_1.ENV.MICROSOFT.CALLBACK_URL));
    }
    createOAuthState(provider) {
        const payload = {
            provider,
            nonce: (0, crypto_1.randomBytes)(16).toString('hex'),
            exp: Date.now() + 10 * 60 * 1000,
        };
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = this.signOAuthState(encodedPayload);
        return `${encodedPayload}.${signature}`;
    }
    verifyOAuthState(state, provider) {
        if (!state) {
            return false;
        }
        const [encodedPayload, signature] = state.split('.');
        if (!encodedPayload || !signature) {
            return false;
        }
        const expectedSignature = this.signOAuthState(encodedPayload);
        const signatureBuffer = Buffer.from(signature);
        const expectedSignatureBuffer = Buffer.from(expectedSignature);
        if (signatureBuffer.length !== expectedSignatureBuffer.length ||
            !(0, crypto_1.timingSafeEqual)(signatureBuffer, expectedSignatureBuffer)) {
            return false;
        }
        try {
            const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
            return payload.provider === provider && payload.exp > Date.now();
        }
        catch {
            return false;
        }
    }
    getMicrosoftAuthorizationUrl(state) {
        const url = new URL(`https://login.microsoftonline.com/${encodeURIComponent(env_1.ENV.MICROSOFT.TENANT_ID || '')}/oauth2/v2.0/authorize`);
        url.searchParams.set('client_id', env_1.ENV.MICROSOFT.CLIENT_ID || '');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('redirect_uri', env_1.ENV.MICROSOFT.CALLBACK_URL || '');
        url.searchParams.set('response_mode', 'query');
        url.searchParams.set('scope', env_1.ENV.MICROSOFT.SCOPES);
        url.searchParams.set('state', state);
        return url.toString();
    }
    async microsoftLoginWithCode(code) {
        const token = await this.exchangeMicrosoftCode(code);
        if (!token.access_token) {
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: token.error_description ||
                    token.error ||
                    'Microsoft token exchange failed',
            };
        }
        const profile = await this.fetchMicrosoftProfile(token.access_token);
        const email = profile.mail || profile.userPrincipalName;
        if (!email) {
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: 'Microsoft account did not return an email address',
            };
        }
        return this.ssoLogin(email, 'Microsoft');
    }
    buildSsoSuccessRedirect(provider, auth) {
        const url = new URL(this.getSsoRedirectUrl(true));
        url.searchParams.set('provider', provider);
        const fragment = new URLSearchParams({
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
        });
        return `${url.toString()}#${fragment.toString()}`;
    }
    buildSsoErrorRedirect(provider, code, message) {
        const url = new URL(this.getSsoRedirectUrl(false));
        url.searchParams.set('provider', provider);
        url.searchParams.set('error', code);
        url.searchParams.set('message', message);
        return url.toString();
    }
    async ssoLogin(email, provider) {
        const userResult = await this.userService.getUserByEmail(email);
        const { statusCode, data } = userResult;
        if (statusCode !== code_1.OK_CODE || !data) {
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: 'User not found. Please contact administrator.',
            };
        }
        if (!data.isActive) {
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: 'User account is inactive',
            };
        }
        const roleName = data.role?.nameRole;
        const accessToken = this.genAccessToken(data.username, data.userID, data.email, data.roleId, data.departmentID, roleName);
        const refreshToken = this.genRefreshToken(data.userID, data.username || '', data.email);
        await this.userService.updateUser(data.userID, { refreshToken });
        return {
            statusCode: code_1.CREATED_RESPONE,
            message: `${provider} login successful`,
            data: {
                accessToken,
                refreshToken,
                user: this.toAuthUser(data),
            },
        };
    }
    signOAuthState(encodedPayload) {
        return (0, crypto_1.createHmac)('sha256', env_1.ENV.JWT.ACCESS_SECRET)
            .update(encodedPayload)
            .digest('base64url');
    }
    isConfiguredValue(value) {
        const normalized = String(value || '').trim();
        return (normalized.length > 0 &&
            normalized !== '...' &&
            !normalized.startsWith('your-') &&
            !normalized.includes('[PASSWORD]') &&
            !normalized.includes('[PROJECT-REF]'));
    }
    getSsoRedirectUrl(isSuccess) {
        const configuredUrl = isSuccess
            ? env_1.ENV.SSO.SUCCESS_REDIRECT_URL
            : env_1.ENV.SSO.ERROR_REDIRECT_URL;
        if (configuredUrl) {
            return configuredUrl;
        }
        const frontendOrigin = env_1.ENV.CORS_ORIGIN.split(',')[0]?.trim();
        return `${frontendOrigin || 'http://localhost:5173'}/auth/callback`;
    }
    async exchangeMicrosoftCode(code) {
        const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(env_1.ENV.MICROSOFT.TENANT_ID || '')}/oauth2/v2.0/token`;
        const body = new URLSearchParams({
            client_id: env_1.ENV.MICROSOFT.CLIENT_ID || '',
            client_secret: env_1.ENV.MICROSOFT.CLIENT_SECRET || '',
            code,
            grant_type: 'authorization_code',
            redirect_uri: env_1.ENV.MICROSOFT.CALLBACK_URL || '',
            scope: env_1.ENV.MICROSOFT.SCOPES,
        });
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        });
        const payload = (await response.json());
        if (!response.ok) {
            return {
                error: payload.error || String(response.status),
                error_description: payload.error_description || 'Microsoft token endpoint failed',
            };
        }
        return payload;
    }
    async fetchMicrosoftProfile(accessToken) {
        const response = await fetch('https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Microsoft profile endpoint failed');
        }
        return (await response.json());
    }
    genAccessToken(username, userID, email, roleId, departmentID, roleName) {
        const payload = {
            userID,
            username,
            email,
            roleId,
            role: roleName,
            roleName,
            departmentID,
        };
        const acessToken = jwt.sign(payload, env_1.ENV.JWT.ACCESS_SECRET, {
            expiresIn: '15m',
        });
        return acessToken;
    }
    genRefreshToken(userID, username, email) {
        const payload = {
            userID,
            username,
            email,
        };
        const refreshToken = jwt.sign(payload, env_1.ENV.JWT.REFRESH_SECRET, {
            expiresIn: '7d',
        });
        return refreshToken;
    }
    async refreshToken(userID, refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, env_1.ENV.JWT.REFRESH_SECRET);
            if (decoded.userID !== userID)
                return {
                    statusCode: code_1.UNAUTHORIZED_CODE,
                    message: 'refreshToken khong dung ',
                };
        }
        catch {
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: 'refreshToken is invalid or expired',
            };
        }
        const { statusCode, message, data } = await this.userService.getUserByUserID(userID);
        if (statusCode != code_1.OK_CODE || data === undefined)
            return {
                statusCode,
                message,
            };
        if (data.refreshToken !== refreshToken)
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: 'refreshToken khong dung ',
            };
        if (data.isActive !== true)
            return {
                statusCode: code_1.UNAUTHORIZED_CODE,
                message: 'User account is inactive',
            };
        const roleName = data.role?.nameRole;
        const newAcessToken = this.genAccessToken(data.username, data.userID, data.email, data?.roleId, data?.departmentID, roleName);
        const newRefreshToken = this.genRefreshToken(data.userID, data.username, data.email);
        const updateUser = await this.userService.updateUser(data.userID, { refreshToken: newRefreshToken });
        if (updateUser.statusCode !== code_1.OK_CODE)
            return {
                statusCode,
                message,
            };
        return {
            statusCode: code_1.CREATED_RESPONE,
            message: `update refreshToken successfull`,
            data: {
                refreshToken: newRefreshToken,
                accessToken: newAcessToken,
                user: this.toAuthUser(data),
            },
        };
    }
    async logout(userID) {
        await this.userService.updateUser(userID, { refreshToken: '' });
        return { statusCode: code_1.CREATED_RESPONE, message: 'log out successfully' };
    }
    toAuthUser(data) {
        return {
            userID: data.userID,
            email: data.email,
            username: data.username,
            linkAvatar: data.linkAvatar,
            phone: data.phone,
            address: data.address,
            emergencyContact: data.emergencyContact,
            salaryCoefficient: data.salaryCoefficient,
            birthday: data.birthday,
            remainDaysofLeave: data.remainDaysofLeave,
            totalDaysofLeave: data.totalDaysofLeave,
            isActive: data.isActive,
            roleId: data.roleId,
            departmentID: data.departmentID,
            role: data.role,
            department: data.department,
        };
    }
    async sendResetCode(email) {
        const userResult = await this.userService.getUserByEmail(email);
        if (userResult.statusCode !== code_1.OK_CODE || !userResult.data) {
            return {
                statusCode: code_1.NOTFOUND_CODE,
                message: 'User not found. Please contact administrator.',
            };
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);
        await this.prismaService.user.update({
            where: { userID: userResult.data.userID },
            data: {
                resetPasswordCode: code,
                resetPasswordExpires: expires,
            },
        });
        const emailResult = await this.emailService.send({
            to: email,
            subject: '[HRM] Mã xác nhận đặt lại mật khẩu',
            text: `Xin chào ${userResult.data.username},\n\nMã xác nhận để đặt lại mật khẩu của bạn là: ${code}\n\nMã này sẽ hết hạn sau 5 phút.\nNếu bạn không yêu cầu đặt lại mật khẩu, xin vui lòng bỏ qua email này.\n\nTrân trọng,\nHệ thống HRM`,
        });
        if (!emailResult.sent) {
            await this.prismaService.user.update({
                where: { userID: userResult.data.userID },
                data: {
                    resetPasswordCode: null,
                    resetPasswordExpires: null,
                },
            });
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: `Failed to send email. Please check your configuration or try again later. Error: ${emailResult.error || emailResult.message}`,
            };
        }
        return {
            statusCode: code_1.OK_CODE,
            message: 'If the email exists, a reset code has been sent.',
        };
    }
    async verifyResetCode(email, code) {
        const userResult = await this.userService.getUserByEmail(email);
        if (userResult.statusCode !== code_1.OK_CODE || !userResult.data) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Invalid code or email.',
            };
        }
        const user = await this.prismaService.user.findUnique({
            where: { userID: userResult.data.userID },
        });
        if (!user || user.resetPasswordCode !== code) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Invalid code or email.',
            };
        }
        if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Code has expired. Please request a new one.',
            };
        }
        return {
            statusCode: code_1.OK_CODE,
            message: 'Code is valid.',
        };
    }
    async resetPassword(email, code, newPassword) {
        const verifyResult = await this.verifyResetCode(email, code);
        if (verifyResult.statusCode !== code_1.OK_CODE) {
            return verifyResult;
        }
        const userResult = await this.userService.getUserByEmail(email);
        if (userResult.statusCode !== code_1.OK_CODE || !userResult.data) {
            return {
                statusCode: code_1.BADREQUEST_CODE,
                message: 'Invalid code or email.',
            };
        }
        const hashedPassword = await this.bcryptHashedservice.hash(newPassword);
        await this.prismaService.user.update({
            where: { userID: userResult.data.userID },
            data: {
                hashedPassword: hashedPassword,
                resetPasswordCode: null,
                resetPasswordExpires: null,
            },
        });
        return {
            statusCode: code_1.OK_CODE,
            message: 'Password has been successfully reset.',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        bycypt_hashed_service_1.BycyptHashedService,
        prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map