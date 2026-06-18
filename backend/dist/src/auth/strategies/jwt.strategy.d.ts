import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { RequestUser } from "../../common/types";
interface JwtPayload {
    userID?: string;
    username?: string;
    email?: string;
    roleId?: string;
    role?: string;
    roleName?: string;
    departmentID?: string;
}
declare const JwtStrategy_base: new (options: import("passport-jwt").StrategyOptions) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): RequestUser;
}
export {};
