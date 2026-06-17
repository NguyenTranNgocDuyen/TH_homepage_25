import { TypeLeaveService } from './type-leave.service';
import { CreateTypeLeaveDto } from './dto/create-type-leave.dto';
import { UpdateTypeLeaveDto } from './dto/update-type-leave.dto';
import { DefaultResponse } from "../common/response.dto";
export declare class TypeLeaveController {
    private readonly typeLeaveService;
    constructor(typeLeaveService: TypeLeaveService);
    getAllTypeLeaves(includeInactive?: string): Promise<DefaultResponse>;
    activateTypeLeave(typeLeaveID: string): Promise<DefaultResponse>;
    deactivateTypeLeave(typeLeaveID: string): Promise<DefaultResponse>;
    getTypeLeave(typeLeaveID: string): Promise<DefaultResponse>;
    createTypeLeave(createDto: CreateTypeLeaveDto): Promise<DefaultResponse>;
    updateTypeLeave(typeLeaveID: string, updateDto: UpdateTypeLeaveDto): Promise<DefaultResponse>;
    deleteTypeLeave(typeLeaveID: string): Promise<DefaultResponse>;
}
