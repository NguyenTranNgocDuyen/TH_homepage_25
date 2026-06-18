import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from "../../prisma/prisma.service";
import { UserService } from "../../user/user.service";
export default class ReviewAuthGuards implements CanActivate {
    private readonly reflector;
    private readonly prismaService;
    private readonly userService;
    constructor(reflector: Reflector, prismaService: PrismaService, userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
