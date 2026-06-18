export declare class SendCodeDto {
    email: string;
}
export declare class VerifyCodeDto {
    email: string;
    code: string;
}
export declare class ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
}
