import { DepartmentService } from './department.service';
import CreateDepartmentDto from './dto/createDepartment.dto';
import DepartmentDto from './dto/department.dto';
import ResponseDto, { AnotherError } from "../common/response.dto";
import UpdateDepartmentDto from './dto/update-department.dto';
import { UserService } from "../user/user.service";
export declare class DepartmentController {
    private readonly departmentService;
    private userService;
    constructor(departmentService: DepartmentService, userService: UserService);
    findAll(): Promise<ResponseDto<DepartmentDto[]> | AnotherError>;
    getDepartmentById(departmentID: string): Promise<ResponseDto<DepartmentDto> | AnotherError>;
    createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<ResponseDto<DepartmentDto> | AnotherError>;
    getDepartmentByDepartmentName(departmentName: string): Promise<ResponseDto<DepartmentDto> | AnotherError>;
    updateDepartment(departmentID: string, updateDepartmentDto: UpdateDepartmentDto): Promise<ResponseDto<DepartmentDto>>;
    deleteDepartment(departmentID: string): Promise<ResponseDto<DepartmentDto>>;
}
