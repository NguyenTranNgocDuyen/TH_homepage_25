import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from "../../user/user.service";
export declare class UserAccessGaurd implements CanActivate {
    private readonly userService;
    private readonly reflector;
    constructor(userService: UserService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private resolveTarget;
}
