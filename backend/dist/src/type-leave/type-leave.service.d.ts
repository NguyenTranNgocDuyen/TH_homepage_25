import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { CreateTypeLeaveDto } from './dto/create-type-leave.dto';
import { UpdateTypeLeaveDto } from './dto/update-type-leave.dto';
import { DefaultResponse } from "../common/response.dto";
export declare class TypeLeaveService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getAllTypeLeaves(includeInactive?: boolean): Promise<DefaultResponse>;
    getTypeLeave(typeLeaveID: string): Promise<DefaultResponse>;
    createTypeLeave(createDto: CreateTypeLeaveDto): Promise<DefaultResponse>;
    updateTypeLeave(typeLeaveID: string, updateDto: UpdateTypeLeaveDto): Promise<DefaultResponse>;
    deleteTypeLeave(typeLeaveID: string): Promise<DefaultResponse>;
    setTypeLeaveActive(typeLeaveID: string, isActive: boolean): Promise<DefaultResponse>;
}
