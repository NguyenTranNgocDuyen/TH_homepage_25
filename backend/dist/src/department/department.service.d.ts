import { Prisma } from '@prisma/client';
import { PrismaService } from "../prisma/prisma.service";
import CreateDepartmentDto from './dto/createDepartment.dto';
import DepartmentDto from './dto/department.dto';
import ResponseDto from "../common/response.dto";
import { UserService } from "../user/user.service";
import UpdateDepartmentDto from './dto/update-department.dto';
import { RoleService } from "../role/role.service";
export declare class DepartmentService {
    private prismaService;
    private userService;
    private readonly roleService;
    constructor(prismaService: PrismaService, userService: UserService, roleService: RoleService);
    findAll(): Promise<ResponseDto<DepartmentDto[]>>;
    createDepartment(DepartmentDto: CreateDepartmentDto): Promise<ResponseDto<DepartmentDto>>;
    getDepartmentById(departmentID: string, tx?: Prisma.TransactionClient): Promise<ResponseDto<DepartmentDto>>;
    getDepartmentByDeparmentName(departmentName: string): Promise<ResponseDto<DepartmentDto>>;
    updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<ResponseDto<DepartmentDto>>;
    deleteDepartment(id: string): Promise<ResponseDto<DepartmentDto>>;
    handleManagerTransfer(tx: Prisma.TransactionClient, departmentID: string, currentManagerID: string | null, newManagerID: string | null): Promise<void>;
}
