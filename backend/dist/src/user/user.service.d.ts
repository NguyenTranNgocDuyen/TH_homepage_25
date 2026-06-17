import { Prisma } from '@prisma/client';
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from "../role/role.service";
import { BycyptHashedService } from "../common/bycypt-hashed/bycypt-hashed.service";
import ResponseDto, { AnotherError, DefaultResponse } from "../common/response.dto";
import UserDto from './dto/user.dto';
import { DepartmentService } from "../department/department.service";
import updateUserDto from './dto/update-user.dto';
import FullUserDto from './dto/full-user.dto';
import { RequestUser } from "../common/types";
import { SelfUpdateUserDto } from './dto/self-update-user.dto';
import { CloudinaryService } from "../common/cloudinary/cloudinary.service";
interface ImportEmployeeError {
    row: number;
    message: string;
}
interface ImportEmployeeSuccess {
    row: number;
    userID: string;
    username: string;
}
interface ImportEmployeesResult {
    importedCount: number;
    errors: ImportEmployeeError[];
    successes: ImportEmployeeSuccess[];
}
export declare class UserService {
    private prismaService;
    private roleService;
    private bcryptHashedService;
    private departmentService;
    private cloudinaryService;
    constructor(prismaService: PrismaService, roleService: RoleService, bcryptHashedService: BycyptHashedService, departmentService: DepartmentService, cloudinaryService: CloudinaryService);
    getAllUser(): Promise<ResponseDto<UserDto[]>>;
    getUserByUserID(userID: string, tx?: Prisma.TransactionClient): Promise<ResponseDto<FullUserDto>>;
    getUserByUserName(username: string, tx?: Prisma.TransactionClient): Promise<ResponseDto<FullUserDto>>;
    getUserByEmail(email: string, tx?: Prisma.TransactionClient): Promise<ResponseDto<FullUserDto>>;
    createUser(createUserDto: CreateUserDto): Promise<ResponseDto<UserDto> | AnotherError>;
    importEmployeesFromExcel(file: Express.Multer.File): Promise<ImportEmployeesResult>;
    updateUser(userID: string, updateUserDto: updateUserDto): Promise<ResponseDto<UserDto>>;
    deactivateUser(userID: string): Promise<ResponseDto<UserDto>>;
    activateUser(userID: string): Promise<ResponseDto<UserDto>>;
    updateSelfProfile(userID: string, dto: SelfUpdateUserDto): Promise<ResponseDto<UserDto>>;
    uploadAvatar(userID: string, file: Express.Multer.File): Promise<ResponseDto<UserDto>>;
    deleteUser(userID: string): Promise<ResponseDto<UserDto>>;
    checkIsManager(userId?: string): Promise<AnotherError>;
    checkAuthIsAdmin(currentUser: RequestUser): Promise<ResponseDto<DefaultResponse>>;
    checkAuthIsMyManager(currentUser: RequestUser, input: string, type: string): Promise<AnotherError>;
    checkAuthIsManagerOfDepartment(currentUser: RequestUser, input: string): Promise<AnotherError>;
    IsMe(currentUser: RequestUser, input: string, type: string): AnotherError;
    getAllUserOfDepartment(departmentID: string): Promise<ResponseDto<UserDto[]>>;
    getManagerIdOfUserID(userID: string, tx?: Prisma.TransactionClient): Promise<DefaultResponse>;
}
export {};
