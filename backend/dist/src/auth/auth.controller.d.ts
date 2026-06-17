import { AuthService } from './auth.service';
import ResponseDto, { AnotherError } from "../common/response.dto";
import LoginDto from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import AuthDto from './dto/auth.dto';
import { SendCodeDto, VerifyCodeDto, ResetPasswordDto } from './dto/forgot-password.dto';
import type { Request } from 'express';
import type { Response } from 'express';
interface UserPayload {
    userID: string;
    username: string;
    email: string;
    roleId: string;
    departmentID?: string;
    role?: {
        nameRole: string;
    };
}
interface RequestWithUser extends Request {
    user: UserPayload;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<ResponseDto<AuthDto>>;
    refreshToken(userID: string, token: RefreshTokenDto): Promise<ResponseDto<AuthDto>>;
    logout(request: RequestWithUser): Promise<ResponseDto<AnotherError>>;
    googleAuth(): void;
    googleAuthRedirect(req: RequestWithUser, res: Response): Promise<void>;
    microsoftAuth(res: Response): void;
    microsoftAuthRedirect(code: string | undefined, state: string | undefined, error: string | undefined, errorDescription: string | undefined, res: Response): Promise<void>;
    sendResetCode(sendCodeDto: SendCodeDto): Promise<ResponseDto<any>>;
    verifyResetCode(verifyCodeDto: VerifyCodeDto): Promise<ResponseDto<any>>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseDto<any>>;
}
export {};
