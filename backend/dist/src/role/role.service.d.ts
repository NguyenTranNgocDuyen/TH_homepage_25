import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from "../prisma/prisma.service";
import ResponseDto from "../common/response.dto";
import { RoleDto } from './dto/Role.dto';
export declare class RoleService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(createRoleDto: CreateRoleDto): Promise<ResponseDto<RoleDto>>;
    findAll(): Promise<ResponseDto<RoleDto[]>>;
    findOne(roleID: string): Promise<ResponseDto<RoleDto>>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<ResponseDto<RoleDto>>;
    remove(id: string): Promise<ResponseDto<RoleDto>>;
    getRoleByRoleName(nameRole: string): Promise<ResponseDto<RoleDto>>;
    isAdmin(roleID: string): Promise<ResponseDto<RoleDto>>;
    isManager(roleID: string): Promise<ResponseDto<RoleDto>>;
}
