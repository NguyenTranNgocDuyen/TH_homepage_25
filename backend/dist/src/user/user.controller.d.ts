import { Request } from 'express';
import { RequestUser } from "../common/types";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import ResponseDto, { AnotherError } from "../common/response.dto";
import UserDto from './dto/user.dto';
import updateUserDto from './dto/update-user.dto';
import { SelfUpdateUserDto } from './dto/self-update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUser(): Promise<ResponseDto<UserDto[]> | AnotherError>;
    getUserByID(userID: string): Promise<ResponseDto<UserDto> | AnotherError>;
    getUserByUsername(useranme: string): Promise<ResponseDto<UserDto> | AnotherError>;
    getUserByEmail(email: string): Promise<ResponseDto<UserDto> | AnotherError>;
    getUserAllUserByDepartmentID(departmentID: string): Promise<ResponseDto<UserDto[]> | AnotherError>;
    createUser(createUserDto: CreateUserDto): Promise<ResponseDto<UserDto> | AnotherError>;
    updateMe(req: Request & {
        user: RequestUser;
    }, selfUpdateDto: SelfUpdateUserDto): Promise<ResponseDto<UserDto>>;
    uploadAvatar(req: Request & {
        user: RequestUser;
    }, file: Express.Multer.File): Promise<ResponseDto<UserDto>>;
    updateUser(id: string, updateUserDto: updateUserDto): Promise<ResponseDto<UserDto>>;
    deactivateUser(userID: string, req: Request & {
        user: RequestUser;
    }): Promise<ResponseDto<UserDto>>;
    activateUser(userID: string): Promise<ResponseDto<UserDto>>;
    deleteUser(userID: string, req: Request & {
        user: RequestUser;
    }): Promise<ResponseDto<UserDto>>;
}
export declare class EmployeeImportController {
    private readonly userService;
    constructor(userService: UserService);
    importEmployees(file: Express.Multer.File): Promise<ResponseDto<{
        importedCount: number;
        errors: Array<{
            row: number;
            message: string;
        }>;
        successes: Array<{
            row: number;
            userID: string;
            username: string;
        }>;
    }>>;
}
