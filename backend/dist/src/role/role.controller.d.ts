import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto } from './dto/Role.dto';
import ResponseDto, { AnotherError } from "../common/response.dto";
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createRoleDto: CreateRoleDto): Promise<ResponseDto<RoleDto> | AnotherError>;
    findAll(): Promise<ResponseDto<RoleDto[]> | AnotherError>;
    findOne(id: string): Promise<ResponseDto<RoleDto> | AnotherError>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<ResponseDto<RoleDto> | AnotherError>;
    remove(id: string): Promise<ResponseDto<RoleDto> | AnotherError>;
    getRoleBYNameRole(nameRole: string): Promise<ResponseDto<RoleDto> | AnotherError>;
}
